import { useEffect, useState } from "react";
import Switch from "../Switch";
import { ChevronDown, Plus, X, Trash } from "lucide-react";
import { GradientButton } from "../Buttons";
import Image from "next/image";
import { useToast } from "@/context/ToastContext"; 
import { MenuItem } from "@/types/MenuItemType";
import { useMenuItem } from "@/context/MenuItemContext";

interface Props {
    closeModal: () => void;
    onSuccess: () => void; 
    branchId: string;      
    category?: {
        _id: string,
        name: string
    };
}

// Extend MenuState locally so we can track the file and preview URL per-item!
interface LocalItem extends MenuItem {
    preview: string | null;
    file: File | null;
}

export default function AddItemsForm({ closeModal, onSuccess, branchId, category }: Props) {
    const { showToast } = useToast();
    const { refreshMenuItems } = useMenuItem()
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>(category ? [category] : []); 
    
    // Tracks the "New" item being drafted
    const [menu, setMenu] = useState<LocalItem>({
        name: '', category: category?._id || '', price: '', description: '', image: '', isAvailable: false, preview: null, file: null
    });
    
    // Tracks the items already added to the list
    const [menusItems, setMenusItems] = useState<LocalItem[]>([]);
    
    // UI States: Tracks which accordion is open, and which one is being dragged over
    const [expandedIndex, setExpandedIndex] = useState<number | 'new'>('new');
    const [draggingIndex, setDraggingIndex] = useState<number | 'new' | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`/api/user-admin/menu/${branchId}/category`);
                const data = await res.json();
                if (res.ok) setCategories(data.categories || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, [branchId]);

    const handleClose = () => {
        setMenu({ name: '', category: category?._id || '', price: '', description: '', image: '', isAvailable: false, preview: null, file: null }); 
        setMenusItems([]);
        closeModal();
    }

    // --- SMART UPDATE FUNCTIONS ---
    // These functions figure out if we are updating the 'new' form OR an existing item in the array
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
        updateItemData(index, 'isEnable', !currentState);
    };

    const handleFileChange = (index: number | 'new', selectedFile: File | undefined) => {
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            updateItemData(index, 'file', selectedFile);
            updateItemData(index, 'preview', URL.createObjectURL(selectedFile));
        }
    };

    const handleDeleteItem = (indexToRemove: number) => {
        setMenusItems(prev => prev.filter((_, i) => i !== indexToRemove));
        setExpandedIndex('new'); // Default back to the new form
    };

    // --- ACTION BUTTONS ---
    const handleAddMoreItems = () => {
        // We only validate and push if they click this while on the 'new' form
        if (expandedIndex === 'new') {
            if (!menu.category || !menu.name) {
                showToast("Please provide a name and select a category", "error");
                return;
            }
            setMenusItems(prev => [...prev, menu]);
            setMenu({ name: '', category: category?._id || '', price: '', description: '', image: '', isAvailable: false, preview: null, file: null }); 
        }
        
        // Ensure the view switches back to a fresh empty form
        setExpandedIndex('new');
    }

    const handleSubmitItems = async () => {
        let rawItems = [...menusItems];
        
        // If they filled out the 'new' form but forgot to click 'Add more', grab it anyway!
        if (menu.name.trim() !== '') {
            if (!menu.category) {
                showToast("Please select a category for your new item", "error");
                return;
            }
            rawItems.push(menu);
        }

        if (rawItems.length === 0) {
            showToast("Please add at least one item", "error");
            return;
        }

        setIsLoading(true);

        const finalItemsToSubmit = rawItems.map(item => ({
            name: item.name,
            description: item.description,
            price: Number(item.price) || 0,
            isAvailable: item.isAvailable, 
            categoryId: item.category, 
            image: { url: "temp_random_string", publicId: "temp_random_id" }
        }));

        try {
            const res = await fetch(`/api/user-admin/menu/${branchId}/item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: finalItemsToSubmit })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            showToast(data.message, "success");
            refreshMenuItems();
            onSuccess();
        } catch (error: any) {
            showToast(error.message || "Failed to save items", "error");
        } finally {
            setIsLoading(false);
        }
    }

    // --- REUSABLE FORM RENDERER ---
    // This generates the actual inputs for whichever item is currently expanded!
    const renderForm = (itemData: LocalItem, index: number | 'new') => (
        <div className="bg-[#EAECF0] p-4 rounded-b-2xl grid gap-5 border-t border-gray-200">
            <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-[#344054]">Name of item</label>
                    <input type="text" name="name" value={itemData.name} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]" placeholder="e.g. Jollof Rice" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-[#344054]">Category</label>
                    <select name="category" value={itemData.category} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer">
                        <option value="" disabled>Select a category</option>
                        {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#344054]">Price of item</label>
                <input type="number" name="price" value={itemData.price} onChange={(e) => handleChange(index, e)} className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]" placeholder="₦ 0.00" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#344054]">Description</label>
                <textarea name="description" value={itemData.description} onChange={(e) => handleChange(index, e)} cols={40} className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] h-20" placeholder="Write a description" />
            </div>

            <label className="text-sm font-medium text-[#344054] -mb-4">Upload Image</label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDraggingIndex(index); }}
                onDragLeave={() => setDraggingIndex(null)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDraggingIndex(null);
                    handleFileChange(index, e.dataTransfer.files?.[0]); 
                }}
                className={`relative w-full h-36 rounded-2xl border flex flex-col items-center justify-center transition-all overflow-hidden mb-3 ${draggingIndex === index ? "border-[#68A544] bg-[#68A544]/5" : "border-gray-300 bg-white hover:bg-gray-50"}`}
            >
                {/* Notice the unique ID for each file input based on its index! */}
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
                            <p className="text-[#666666] font-medium text-xs">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                </label>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Switch enabled={itemData.isAvailable} onClick={() => handleToggle(index, itemData.isAvailable)} />
                    <p className="text-sm">Item is available</p>
                </div>
                
                {/* Delete button only appears for old items, not the 'new' empty form */}
                {index !== 'new' && (
                    <button onClick={() => handleDeleteItem(index)} className="text-red-500 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Trash size={16} /> Remove 
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div onClick={(e) => e.stopPropagation()} className="w-140 max-h-[90vh] rounded-3xl relative overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="bg-white px-6 py-10">
                <div className="flex justify-between items-center">
                    <h6 className="font-medium text-2xl">Add new item</h6>
                    <div onClick={handleClose} className="w-10 h-10 bg-linear-to-r from-[#f67d265c] to-[#68a54432] rounded-full flex justify-center items-center cursor-pointer"><X /></div>
                </div>
                <p className="text-[#333333] my-5">Enter product details below</p>

                <div className="flex flex-col gap-3 mb-4"> 
                    
                    {/* 1. Map over previously added items */}
                    {menusItems.map((m, index) => (
                        <div key={index} className="flex flex-col shadow-sm">
                            <div 
                                onClick={() => setExpandedIndex(expandedIndex === index ? 'new' : index)}
                                className={`bg-[#EAECF0] flex justify-between items-center p-4 cursor-pointer transition-colors hover:bg-gray-200 ${expandedIndex === index ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                            >
                                <p className="text-[#101828] font-medium">{m.name || `Unnamed Item ${index + 1}`}</p>
                                <ChevronDown className={`transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {/* If expanded, render its form! */}
                            {expandedIndex === index && renderForm(m, index)}
                        </div>
                    ))}

                    {/* 2. The "New Item" Accordion */}
                    <div className="flex flex-col mt-2 shadow-sm">
                        {/* Only show the 'Add New' header if they are currently looking at an older item */}
                        {expandedIndex !== 'new' && menusItems.length > 0 && (
                            <div 
                                onClick={() => setExpandedIndex('new')}
                                className="bg-[#68A544]/10 border border-[#68A544]/30 rounded-2xl flex justify-between items-center p-4 cursor-pointer hover:bg-[#68A544]/20 transition-colors"
                            >
                                <p className="text-[#68A544] font-medium">Add another item</p>
                                <Plus className="text-[#68A544]" />
                            </div>
                        )}

                        {/* If 'new' is expanded, render the empty form! */}
                        {expandedIndex === 'new' && (
                            <div className={menusItems.length > 0 ? "mt-4" : ""}>
                                {/* Add a subtle title if there are multiple items on screen */}
                                {menusItems.length > 0 && <p className="text-sm font-medium text-gray-500 mb-2 ml-1">Drafting new item...</p>}
                                <div className="rounded-t-2xl overflow-hidden">
                                    {renderForm(menu, 'new')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Add More Button (Only active when looking at the New form) */}
                {expandedIndex === 'new' ? (
                    <div onClick={handleAddMoreItems} className="my-5 bg-[#68A544] flex text-white w-fit px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[#5b913b] transition-colors" >
                        <Plus size={20} className="mr-1" />
                        <p className="font-medium">Save & Add Another</p>
                    </div>
                ) : (
                    <div onClick={() => setExpandedIndex('new')} className="my-5 bg-gray-100 flex text-gray-700 w-fit px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors" >
                        <p className="font-medium">Done Editing</p>
                    </div>
                )}
            </div>
        
            <div className="bg-[#F0F0F0] p-6 sticky bottom-0 z-20">
                <GradientButton onClick={handleSubmitItems} label={isLoading ? "Saving items..." : `Add ${menusItems.length + (menu.name ? 1 : 0)} items to menu`} className="w-full" disabled={isLoading}  />
            </div>
        </div>
    )
}