import { useEffect, useState } from "react";
import Switch from "../Switch";
import { ChevronDown, Plus, X, Trash } from "lucide-react";
import { GradientButton } from "../Buttons";
import Image from "next/image";
import { useToast } from "@/context/ToastContext"; 
import { useMenuItem } from "@/context/MenuItemContext";
import { useCategory } from "@/context/CategoryContext";
import { useZone } from "@/context/ZoneContext";
import { useRouter } from "next/navigation";
import { useUserAdmin } from "@/context/UserAdminContext";
import imageCompression from 'browser-image-compression';

interface Props {
    closeModal: () => void;
    onSuccess: () => void; 
    onUpgradeRequired?: () => void;
    branchId: string;      
    category?: {
        _id: string,
        name: string
    };
}

interface LocalItem {
    name: string;
    category: string;
    zoneId: string;
    price: number | ''; 
    description: string;
    image?: { url: string; publicId: string };
    isAvailable: boolean;
    preview: string | null;
    file: File | null;
}

export default function AddItemsForm({ closeModal, onSuccess, branchId, category, onUpgradeRequired }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const { refreshMenuItems } = useMenuItem();
    const { categories } = useCategory();
    const { branch } = useUserAdmin();
    const { zones } = useZone();

    const [isLoading, setIsLoading] = useState(false);
    const isProPlan = branch?.plans?.planType === 'pro';
    
    const [menu, setMenu] = useState<LocalItem>({
        name: '', category: category?._id || '', zoneId: '', price: '', description: '', isAvailable: false, preview: null, file: null
    });
    
    const [menusItems, setMenusItems] = useState<LocalItem[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | 'new'>('new');
    const [draggingIndex, setDraggingIndex] = useState<number | 'new' | null>(null);

    const handleClose = () => {
        setMenu({ name: '', category: category?._id || '', zoneId: '', price: '', description: '', isAvailable: false, preview: null, file: null }); 
        setMenusItems([]);
        closeModal();
    }

    const updateItemData = (index: number | 'new', field: string, value: any) => {
        if (index === 'new') {
            setMenu(prev => ({ ...prev, [field]: value }));
        } else {
            setMenusItems(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
            });
        }
    };

    const handleChange = (index: number | 'new', e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        updateItemData(index, e.target.name, e.target.value);
    }

    const handleToggle = (index: number | 'new', currentState: boolean) => {
        updateItemData(index, 'isAvailable', !currentState); 
    };

    const handleFileChange = async (index: number | 'new', selectedFile: File | undefined) => {
        if (!selectedFile || !selectedFile.type.startsWith("image/")) return;

        try {
            const options = {
                maxSizeMB: 0.5, 
                maxWidthOrHeight: 800, 
                useWebWorker: true, 
            };

            const compressedFile = await imageCompression(selectedFile, options);
            
            updateItemData(index, 'file', compressedFile);
            updateItemData(index, 'preview', URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Compression error:", error);
            showToast("Failed to process image. Please try a different file.", "error");
        }
    };

    const handleDeleteItem = (indexToRemove: number) => {
        setMenusItems(prev => prev.filter((_, i) => i !== indexToRemove));
        setExpandedIndex('new'); 
    };

    const handleAddMoreItems = () => {
        if (expandedIndex === 'new') {
            if (!menu.category || !menu.name || (isProPlan && !menu.zoneId )) {
                showToast("Please provide a name, category, and zone", "error");
                return;
            }
            setMenusItems(prev => [...prev, menu]);
            setMenu({ name: '', category: category?._id || '', zoneId: '', price: '', description: '', isAvailable: false, preview: null, file: null }); 
        }
        setExpandedIndex('new');
    }

    const handleSubmitItems = async () => {
        let rawItems = [...menusItems];
        
        if (menu.name.trim() !== '') {
            if (!menu.category || (isProPlan && !menu.zoneId ) ) {
                showToast("Please select a category and zone for your new item", "error");
                return;
            }
            rawItems.push(menu);
        }

        if (rawItems.length === 0) {
            showToast("Please add at least one item", "error");
            return;
        }

        setIsLoading(true);
        let uploadedPublicIds: string[] = []; 

        try {
            const signRes = await fetch('/api/cloudinary/cloudinary-sign', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'menu_items' })
            });
            
            if (!signRes.ok) {
                const signError = await signRes.json();
                throw new Error(`Signature failed: ${signError.error || 'Unknown server error'}`);
            }
            
            const { signature, timestamp, folder } = await signRes.json();
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

            const finalItemsToSubmit = await Promise.all(rawItems.map(async (item) => {
                let finalImage = null;

                if (item.file && cloudName) {
                    const formData = new FormData();
                    formData.append('file', item.file);
                    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
                    formData.append('timestamp', timestamp.toString());
                    formData.append('signature', signature);
                    formData.append('folder', folder);

                    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    const cloudData = await uploadRes.json();
                    
                    if (!uploadRes.ok || cloudData.error) {
                        console.error("Cloudinary Detailed Error:", cloudData);
                        throw new Error(`Image upload failed: ${cloudData.error?.message || 'Unknown Cloudinary error'}`);
                    }
                    
                    if (cloudData.secure_url) {
                        finalImage = { url: cloudData.secure_url, publicId: cloudData.public_id };
                        uploadedPublicIds.push(cloudData.public_id); 
                    } else {
                        throw new Error(`Image upload failed: No secure_url returned from Cloudinary`);
                    }
                }

                return {
                    name: item.name,
                    description: item.description,
                    price: Number(item.price) || 0,
                    isAvailable: item.isAvailable, 
                    categoryId: item.category, 
                    image: finalImage,
                    zoneId: item.zoneId
                };
            }));

            const res = await fetch(`/api/user-admin/${branchId}/menu/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: finalItemsToSubmit })
            });
            
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 403 && data.code === "UPGRADE_REQUIRED") {
                    handleClose();
                    onUpgradeRequired?.(); 
                }
                throw new Error(data.error || "Failed to save items");
            }

            showToast(data.message, "success");
            refreshMenuItems();
            onSuccess();
            handleClose(); 

        } catch (error: any) {
            console.error("Submission Error:", error);
            
            if (uploadedPublicIds.length > 0) {
                console.log("Rolling back Cloudinary uploads...", uploadedPublicIds);
                fetch('/api/cloudinary/cloudinary-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicIds: uploadedPublicIds })
                }).catch(e => console.error("Rollback failed to execute:", e));
            }

            showToast(error.message || "Failed to save items", "error");
        } finally {
            setIsLoading(false);
        }
    }

    const renderForm = (itemData: LocalItem, index: number | 'new') => (
        <div className="bg-[#EAECF0] p-4 md:p-6 rounded-b-2xl border-t border-gray-200">
            {/* Grid Layout for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                
                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#344054]">Name of item</label>
                    <input type="text" name="name" value={itemData.name} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]" placeholder="e.g. Jollof Rice" />
                </div>
                
                {/* Category */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#344054]">Category</label>
                    {categories.length === 0 ? (
                        <div 
                            onClick={() => {
                                showToast("Opening category manager...", "error"); 
                                closeModal();
                                router.push(`/dashboard/${branch?.slug}/menu?modal=new-category`); 
                            }}
                            className="w-full rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors"
                        >
                            <span className="text-sm text-red-600">No categories found</span>
                            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">+ Create</span>
                        </div>
                    ) : (
                        <select name="category" value={itemData.category} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer">
                            <option value="" disabled>Select a category</option>
                            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                    )}
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#344054]">Price of item</label>
                    <input type="number" name="price" value={itemData.price} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]" placeholder="₦ 0.00" />
                </div>

                {/* Zone (Conditional) */}
                {isProPlan && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#344054]">Zone</label>
                    {zones.length === 0 ? (
                        <div 
                            onClick={() => {
                                showToast("Please create a table zone first", "error");
                                closeModal();
                                router.push(`/dashboard/${branch?.slug}/settings/tables?tab=Zones`); 
                            }}
                            className="w-full rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors"
                        >
                            <span className="text-sm text-red-600">No zones found</span>
                            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">+ Create</span>
                        </div>
                    ) : (
                        <select name="zoneId" value={itemData.zoneId} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer">
                            <option value="" disabled>Select a zone</option>
                            {zones.map((z) => (<option key={z._id} value={z._id}>{z.name}</option>))}
                        </select>
                    )}
                </div>
                )}
                
                {/* Description (Spans full width) */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-medium text-[#344054]">Description</label>
                    <textarea name="description" value={itemData.description} onChange={(e) => handleChange(index, e)} cols={40} className="w-full rounded-lg bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] h-20" placeholder="Write a description" />
                </div>

                {/* Upload Image (Spans full width) */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-medium text-[#344054]">Upload Image</label>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDraggingIndex(index); }}
                        onDragLeave={() => setDraggingIndex(null)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDraggingIndex(null);
                            handleFileChange(index, e.dataTransfer.files?.[0]); 
                        }}
                        className={`relative w-full h-36 rounded-2xl border flex flex-col items-center justify-center transition-all overflow-hidden ${draggingIndex === index ? "border-[#68A544] bg-[#68A544]/5" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                    >
                        <input id={`file-upload-${index}`} type="file" onChange={(e) => handleFileChange(index, e.target.files?.[0])} accept="image/*" className="hidden" />
                        <label htmlFor={`file-upload-${index}`} className="absolute inset-0 z-10 cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            {itemData.preview ? (
                                <div className="relative w-full h-full">
                                    <Image src={itemData.preview} alt="Upload preview" fill className="object-cover rounded-lg" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full text-sm">Click to Change</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-[#666666] font-medium text-sm">Click to upload or drag and drop</p>
                                    <p className="text-[#666666] font-medium text-xs mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Footer Controls (Spans full width) */}
                <div className="flex items-center justify-between md:col-span-2 mt-2">
                    <div className="flex items-center gap-2">
                        <Switch enabled={itemData.isAvailable} onClick={() => handleToggle(index, itemData.isAvailable)} />
                        <p className="text-sm font-medium text-gray-700">Item is available</p>
                    </div>
                    
                    {index !== 'new' && (
                        <button onClick={() => handleDeleteItem(index)} className="text-red-500 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Trash size={16} /> Remove 
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] rounded-3xl relative overflow-y-auto no-scrollbar bg-white">
            <div className="px-5 py-6 md:px-8 md:py-8">
                <div className="flex justify-between items-center mb-2">
                    <h6 className="font-bold text-xl md:text-2xl text-[#101828]">Add new item</h6>
                    <div onClick={handleClose} className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex justify-center items-center cursor-pointer transition-colors text-gray-600"><X size={20} /></div>
                </div>
                <p className="text-gray-500 text-sm md:text-base mb-6">Enter product details below</p>

                <div className="flex flex-col gap-3 mb-4"> 
                    {menusItems.map((m, index) => (
                        <div key={index} className="flex flex-col shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
                            <div 
                                onClick={() => setExpandedIndex(expandedIndex === index ? 'new' : index)}
                                className={`bg-gray-50 flex justify-between items-center p-4 md:p-5 cursor-pointer transition-colors hover:bg-gray-100 ${expandedIndex === index ? 'border-b border-gray-200' : ''}`}
                            >
                                <p className="text-[#101828] font-bold">{m.name || `Unnamed Item ${index + 1}`}</p>
                                <ChevronDown className={`text-gray-500 transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {expandedIndex === index && renderForm(m, index)}
                        </div>
                    ))}

                    <div className="flex flex-col mt-2">
                        {expandedIndex !== 'new' && menusItems.length > 0 && (
                            <div 
                                onClick={() => setExpandedIndex('new')}
                                className="bg-[#68A544]/5 border border-[#68A544]/20 rounded-2xl flex justify-between items-center p-4 cursor-pointer hover:bg-[#68A544]/10 transition-colors"
                            >
                                <p className="text-[#68A544] font-bold">Add another item</p>
                                <Plus className="text-[#68A544]" />
                            </div>
                        )}

                        {expandedIndex === 'new' && (
                            <div className={`${menusItems.length > 0 ? "mt-4" : ""} rounded-2xl border border-gray-200 overflow-hidden shadow-sm`}>
                                {menusItems.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-bold text-gray-700">Drafting new item...</p>
                                    </div>
                                )}
                                {renderForm(menu, 'new')}
                            </div>
                        )}
                    </div>
                </div>

                {expandedIndex === 'new' ? (
                    <div onClick={handleAddMoreItems} className="mt-6 mb-2 bg-[#101828] text-white w-fit px-5 py-3 rounded-xl cursor-pointer hover:bg-black transition-colors flex items-center shadow-sm" >
                        <Plus size={18} className="mr-2" />
                        <p className="font-medium text-sm md:text-base">Save & Add Another</p>
                    </div>
                ) : (
                    <div onClick={() => setExpandedIndex('new')} className="mt-6 mb-2 bg-gray-100 text-gray-700 w-fit px-5 py-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors flex items-center" >
                        <p className="font-medium text-sm md:text-base">Done Editing</p>
                    </div>
                )}
            </div>
        
            <div className="bg-gray-50 border-t border-gray-200 p-4 md:p-6 sticky bottom-0 z-20">
                <GradientButton onClick={handleSubmitItems} label={isLoading ? "Saving items & images..." : `Add ${menusItems.length + (menu.name ? 1 : 0)} items to menu`} className="w-full py-3.5 md:py-4 text-base shadow-sm" disabled={isLoading}  />
            </div>
        </div>
    )
}