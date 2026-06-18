"use client";

import React, { useState } from "react";
import { Phone, Mail, Globe, MapPin, Instagram, Twitter, ChevronDown } from "lucide-react";
import { useUserAdmin } from "@/context/UserAdminContext";
import { useToast } from "@/context/ToastContext";
import { signOut } from "next-auth/react"; // <-- Import signOut from NextAuth
import { useRouter } from "next/navigation";
import { nigerianStates } from "@/constant/nigerianStates";



export default function General() {
  const { branch, user } = useUserAdmin();
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: branch?.name || "",
    description: branch?.description || "",
    urlSlug: branch?.slug || "",
    phone: branch?.phone || "",
    email: user?.email || "", 
    website: branch?.website || "",
    street: branch?.location?.address || "",
    state: branch?.location?.state || "",
    postalCode: branch?.location?.postalCode || "",
    country: branch?.location?.country || "Nigeria", 
    instagram: branch?.socials?.instagram || "",
    x: branch?.socials?.x || "",
    tiktok: branch?.socials?.tiktok || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Auto-generate slug from the name
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") 
        .replace(/[\s-]+/g, "-");     

      setFormData((prev) => ({ 
        ...prev, 
        name: value, 
        urlSlug: generatedSlug 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveInfo = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch(`/api/user-admin/${branch?._id}/profile`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message);

        if (formData.urlSlug !== branch?.slug) {
          showToast("Name changed. Logging you out to refresh your session...");
          setTimeout(() => {
            signOut({ callbackUrl: '/login' }); 
          }, 2000);
        } else {
          // 3. Force Next.js to re-fetch the server components (like your layout)
          router.refresh(); 
        }
      } else {
        showToast(data.error);
      }
    } catch (error: any) {
      console.log("Error during saving", error);
      showToast(error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Restaurant Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Restaurant Info</h2>
        <p className="text-sm text-slate-500 mb-6">Basic information about your restaurant</p>

        <div className="space-y-5">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Restaurant name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* URL Slug (Disabled & Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">URL slug</label>
              <input
                type="text"
                name="urlSlug"
                value={formData.urlSlug}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            {/* Email Address (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
              <div className="relative mb-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">Optional. Will be put on main page.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Location Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Location</h2>
        <p className="text-sm text-slate-500 mb-6">Location information of your restaurant</p>

        <div className="space-y-5">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* State Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="" disabled>Select a state</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value="Nigeria">Nigeria</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Social Media Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Social Media</h2>
        <p className="text-sm text-slate-500 mb-6">Social profiles of your restaurant</p>

        <div className="space-y-4">
          {/* Instagram */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <Instagram size={16} className="text-[#E1306C]" />
            </div>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>

          {/* Twitter / X */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <Twitter size={16} className="text-[#1DA1F2]" />
            </div>
            <input
              type="text"
              name="x"
              value={formData.x}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>

          {/* TikTok */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center w-10 h-full border-r border-slate-200 bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <input
              type="text"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveInfo} 
          disabled={saveLoading}
          className="bg-[#68A544] hover:bg-green-700 disabled:opacity-70 transition-colors text-white px-6 py-2 rounded-md font-medium text-sm shadow-sm"
        >
          {saveLoading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}