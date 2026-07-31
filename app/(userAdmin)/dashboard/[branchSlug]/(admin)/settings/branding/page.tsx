'use client'

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext"; 
import { useUserAdmin } from "@/context/UserAdminContext";



const Branding = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { branch } = useUserAdmin();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  
  const [logoState, setLogoState] = useState({
    file: null as File | null,
    previewUrl: branch?.branding?.logo?.url || "",
  });
  
  const [coverState, setCoverState] = useState({
    file: null as File | null,
    previewUrl: branch?.branding?.coverImage?.url || "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "logo") {
      setLogoState({ file, previewUrl });
    } else {
      setCoverState({ file, previewUrl });
    }
  };

  const handleRemove = (type: "logo" | "cover", e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (type === "logo") {
      setLogoState({ file: null, previewUrl: "" });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      setCoverState({ file: null, previewUrl: "" });
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const uploadToCloudinary = async (file: File, folderName: string) => {
    const signRes = await fetch("/api/cloudinary/cloudinary-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: folderName }),
    });

    if (!signRes.ok) throw new Error("Signature failed");

    const { signature, timestamp, folder } = await signRes.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append("file", file);
    
    // 🚨 FIX: Force primitive strings to satisfy TypeScript's strict FormData requirements
    formData.append("api_key", String(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY));
    formData.append("timestamp", String(timestamp));
    formData.append("signature", String(signature));
    formData.append("folder", String(folder));

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const cloudData = await uploadRes.json();
    if (!uploadRes.ok || cloudData.error) throw new Error(cloudData.error?.message || "Upload failed");

    return { url: cloudData.secure_url, publicId: cloudData.public_id };
  };

  const handleSaveChanges = async () => {
    if (!logoState.file && !coverState.file && logoState.previewUrl === branch?.branding?.logo?.url && coverState.previewUrl === branch?.branding?.coverImage?.url) {
        showToast("No changes to save.", "error");
        return;
    }

    setIsLoading(true);
    const uploadedPublicIds: string[] = [];

    try {
      let finalLogo: any = branch?.branding?.logo || null;
      let finalCover: any = branch?.branding?.coverImage || null;

      if (!logoState.previewUrl) finalLogo = null;
      if (!coverState.previewUrl) finalCover = null;

      if (logoState.file) {
        const res = await uploadToCloudinary(logoState.file, "branch_logos");
        finalLogo = res;
        uploadedPublicIds.push(res.publicId);
      }

      if (coverState.file) {
        const res = await uploadToCloudinary(coverState.file, "branch_covers");
        finalCover = res;
        uploadedPublicIds.push(res.publicId);
      }

      const response = await fetch(`/api/user-admin/${branch?._id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo: finalLogo,
          coverImage: finalCover,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Branding updated successfully!", "success");
        setLogoState(prev => ({ ...prev, file: null }));
        setCoverState(prev => ({ ...prev, file: null }));
        router.refresh();
      } else {
        throw new Error(data.error || "Failed to update profile records");
      }
    } catch (error: any) {
      showToast(error.message || "An unexpected error occurred", "error");
      if (uploadedPublicIds.length > 0) {
        fetch("/api/cloudinary/cloudinary-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicIds: uploadedPublicIds }),
        }).catch(err => console.error("Rollback failed:", err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, "logo")} accept="image/*" className="hidden" />
      <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, "cover")} accept="image/*" className="hidden" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Branding</h2>
        <p className="text-sm text-slate-500 mb-6">Customise how your restaurant looks to customers on the public menu page and QR landing screen.</p>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Logo Section */}
          <div className="flex flex-col gap-3 w-full md:w-[280px]">
            <span className="text-sm font-semibold text-slate-800">Restaurant logo</span>
            
            <div 
              onClick={() => !logoState.previewUrl && logoInputRef.current?.click()}
              className={`group relative h-[250px] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all ${
                logoState.previewUrl 
                  ? 'border-2 border-dashed border-[#68A544] bg-white cursor-default' 
                  : 'bg-[#F8FAFC] border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50'
              }`}
            >
              {logoState.previewUrl ? (
                <>
                  {/* 🚨 FIX: Replaced with Next.js Image wrapped in a relative container */}
                  <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-sm">
                    <Image 
                        src={logoState.previewUrl as string} 
                        alt="Logo" 
                        fill 
                        className="object-cover" 
                        unoptimized 
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); logoInputRef.current?.click(); }}
                      className="bg-[#EAF3E6] text-[#68A544] px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-[#dcf0d4] transition-colors"
                    >
                      Replace
                    </button>
                    <button 
                      onClick={(e) => handleRemove("logo", e)}
                      className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Upload className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-slate-800 mb-1">Logo</span>
                  <span className="text-[11px] text-gray-400 mb-5">PNG or SVG, min 200×200px</span>
                  <button className="border border-[#68A544] text-[#68A544] px-5 py-2 rounded-lg text-sm font-medium bg-white hover:bg-green-50 transition-colors">
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Banner Section */}
          <div className="flex flex-col gap-3 flex-1">
            <span className="text-sm font-semibold text-slate-800">Cover banner</span>
            
            <div 
              onClick={() => !coverState.previewUrl && coverInputRef.current?.click()}
              className={`group relative h-[250px] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all ${
                coverState.previewUrl 
                  ? 'border-2 border-dashed border-[#68A544] cursor-default' 
                  : 'bg-[#F8FAFC] border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50'
              }`}
            >
              {coverState.previewUrl ? (
                <>
                  {/* 🚨 FIX: Replaced with Next.js Image (Parent is already relative) */}
                  <Image 
                    src={coverState.previewUrl as string} 
                    alt="Cover" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
                      className="bg-[#EAF3E6] text-[#68A544] px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-[#dcf0d4] transition-colors"
                    >
                      Upload New Cover
                    </button>
                    <button 
                      onClick={(e) => handleRemove("cover", e)}
                      className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Upload className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-slate-800 mb-1">Banner</span>
                  <span className="text-[11px] text-gray-400 mb-5">Recommended: 1440×450px, JPG or PNG, max 4 MB</span>
                  <button className="border border-[#68A544] text-[#68A544] px-5 py-2 rounded-lg text-sm font-medium bg-white hover:bg-green-50 transition-colors">
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="bg-[#101828] hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Details"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Branding;