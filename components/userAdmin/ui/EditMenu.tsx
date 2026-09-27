'use client'

import { Camera, EllipsisVertical, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Switch from './Switch'
import { GradientButton } from './Buttons'
import { Modal } from '../screen/Modal'
import { MenuItem } from '@/types/MenuItemType'
import { useToast } from '@/context/ToastContext'
import Image from 'next/image'
import { useZone } from '@/context/ZoneContext'
import { useUserAdmin } from '@/context/UserAdminContext'

interface EditMenuProps {
  menu: MenuItem;
  branchId: string;
  onSuccess: () => void;
}

export const EditMenu = ({ menu, branchId, onSuccess }: EditMenuProps) => {
  const { showToast } = useToast();
  const { zones } = useZone();
  const [openEdit, setOpenEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  const {branch} = useUserAdmin()
  const isProPlan = branch?.plans?.planType === 'pro';
  
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  const getSafeCategoryId = () => {
    if (!menu.categoryId) return '';
    if (typeof menu.categoryId === 'object' && '_id' in menu.categoryId) {
        return menu.categoryId._id;
    }
    return menu.categoryId as string;
  };

  const getSafeZoneId = () => {
    if (!menu.zoneId) return '';
    if (typeof menu.zoneId === 'object') {
        return (menu.zoneId as any)._id || '';
    }
    return menu.zoneId as unknown as string;
  };

  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: menu.name || '',
    description: menu.description || '',
    price: menu.price || '',
    categoryId: getSafeCategoryId(), 
    zoneId: getSafeZoneId(),
    image: {
      url: menu.image?.url || '',
      publicId: menu.image?.publicId
    },
    isAvailable: menu.isAvailable || false
  });

  const handleCloseModal = () => {
    setOpenEdit(false);
    setUpdate(false);
    setNewImageFile(null);
    setNewImagePreview(null);
  }

  useEffect(() => {
      setFormData({
        name: menu.name || '',
        description: menu.description || '',
        price: menu.price || '',
        categoryId: getSafeCategoryId(),
        zoneId: getSafeZoneId(),
        image: {
          url: menu.image?.url || "",
          publicId: menu.image?.publicId || ""
        },
        isAvailable: menu.isAvailable || false 
      });
  }, [menu]);

  useEffect(() => {
    if (openEdit && categories.length === 0) {
      const fetchCategories = async () => {
        setIsCategoriesLoading(true);
        try {
          const res = await fetch(`/api/user-admin/${branchId}/menu/category`);
          const data = await res.json();
          if (res.ok) setCategories(data.categories || []);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        } finally {
          setIsCategoriesLoading(false);
        }
      };
      fetchCategories();
    }
  }, [openEdit, branchId, categories.length]);

  useEffect(() => {
    if (openEdit) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [openEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.categoryId || !formData.price || (isProPlan && !formData.zoneId)) {
        showToast("Please fill in all required fields", "error");
        setUpdate(false); 
        return;
    }

    setIsSaving(true);
    let finalImagePayload = { url: formData.image.url, publicId: formData.image.publicId };

    try {
      if (newImageFile) {
        const signRes = await fetch('/api/cloudinary/cloudinary-sign', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder: 'menu_items' })
        });
        
        if (!signRes.ok) throw new Error("Failed to get upload signature");
        const { signature, timestamp, folder } = await signRes.json();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        const uploadFormData = new FormData();
        uploadFormData.append('file', newImageFile);
        uploadFormData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
        uploadFormData.append('timestamp', timestamp.toString());
        uploadFormData.append('signature', signature);
        uploadFormData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: uploadFormData
        });
        
        const cloudData = await uploadRes.json();
        if (!uploadRes.ok || cloudData.error) throw new Error("Image upload failed");

        finalImagePayload = { url: cloudData.secure_url, publicId: cloudData.public_id };
        
        if (formData.image.publicId) {
            fetch('/api/cloudinary/cloudinary-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicIds: [formData.image.publicId] })
            }).catch(e => console.error("Failed to delete old image"));
        }
      }

      const res = await fetch(`/api/user-admin/${branchId}/menu/item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: menu._id,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          categoryId: formData.categoryId, 
          zoneId: formData.zoneId, 
          isAvailable: formData.isAvailable,
          image: finalImagePayload
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Item updated successfully", "success");
      handleCloseModal(); 
      onSuccess(); 

    } catch (error: any) {
      showToast(error.message || "Failed to update item", "error");
      setUpdate(false);
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/user-admin/${branchId}/menu/item?itemId=${menu._id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        showToast("Item deleted!", "success");
        handleCloseModal();
        onSuccess(); 
    } catch (error: any) {
        showToast(error.message, "error");
    } finally {
        setIsDeleting(false);
    }
  }

  return (
    <>
      <div onClick={() => setOpenEdit(true)} className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
        <EllipsisVertical size={18} className="text-gray-500" />
      </div>

      {openEdit && (
        <Modal center={update} onClick={handleCloseModal}>
          {
            !update ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50 w-full max-w-[95vw] md:max-w-2xl h-[90vh] sm:h-fit max-h-[90vh] sm:rounded-3xl flex flex-col relative shadow-2xl"
                >
                  <div className="px-5 py-6 md:px-8 md:py-6 border-b border-gray-100 shrink-0">
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider mb-1'>Edit Item</p>
                        <p className='text-xl md:text-2xl font-bold text-[#101828] leading-tight pr-4'>{menu.name}</p>
                      </div>
                      <div className='flex items-center gap-2 shrink-0'>
                        <div onClick={handleDelete} className={`bg-red-50 p-2 md:p-2.5 rounded-full transition-colors ${isDeleting ? 'animate-pulse pointer-events-none' : 'cursor-pointer hover:bg-red-100'}`}>
                          <Trash2 className="text-red-600" size={18} />
                        </div>
                        <div onClick={handleCloseModal} className='bg-gray-100 p-2 md:p-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors'>
                          <X className="text-gray-600" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className='flex flex-col flex-1 overflow-hidden' onSubmit={(e) => e.preventDefault()}>
                    <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6 md:px-8">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className='flex flex-col gap-1 md:col-span-2'>
                          <label className='text-sm font-medium text-[#344054]'>Name of item</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className='w-full rounded-xl border border-[#D0D5DD] bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]' />
                        </div>

                        <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-[#344054]'>Category</label>
                          {isCategoriesLoading ? (
                            <p className="text-sm text-gray-400 p-2.5 border border-gray-200 rounded-xl animate-pulse bg-gray-50">Loading...</p>
                          ) : (
                            <select 
                              name="categoryId" 
                              value={formData.categoryId} 
                              onChange={handleChange}
                              className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer"
                            >
                              <option value="" disabled>Select a category</option>
                              {categories.map((c) => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-[#344054]'>Price (₦)</label>
                          <input type="number" name="price" value={formData.price} onChange={handleChange} className='w-full rounded-xl border border-[#D0D5DD] bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]' />
                        </div>

                        {isProPlan && (
                          <div className='flex flex-col gap-1 md:col-span-2'>
                            <label className='text-sm font-medium text-[#344054]'>Zone</label>
                            <select 
                              name="zoneId" 
                              value={formData.zoneId} 
                              onChange={handleChange}
                              className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer"
                            >
                              <option value="" disabled>Select a zone</option>
                              {zones?.map((z) => (
                                  <option key={z._id} value={z._id}>{z.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className='flex flex-col gap-1 md:col-span-2'>
                          <label className='text-sm font-medium text-[#344054]'>Description</label>
                          <textarea name="description" value={formData.description} onChange={handleChange} className='w-full h-24 rounded-xl border border-[#D0D5DD] bg-white px-3 py-2.5 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] resize-none' />
                        </div>

                        <div className='flex flex-col gap-1 md:col-span-2'>
                          <label className='text-sm font-medium text-[#344054]'>Image of item</label>
                          <label className='w-full h-40 relative rounded-xl block cursor-pointer border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden'>
                            <input type='file' accept="image/*" onChange={handleFileChange} className='hidden' />
                            
                            {(newImagePreview || formData.image.url) ? (
                              <>
                                <Image src={newImagePreview || formData.image.url} alt='item image' fill className='object-cover' />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium bg-black/60 px-4 py-2 rounded-full text-sm backdrop-blur-sm">Click to Change</p>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                  <Camera className="mb-2 text-gray-400" size={32} />
                                  <p className="text-sm font-medium">Click to upload image</p>
                              </div>
                            )}
                          </label>
                        </div>

                        <div className='flex items-center gap-3 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2'>
                          <Switch enabled={formData.isAvailable} onClick={handleToggle} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Item is available</p>
                            <p className="text-xs text-gray-500">Customers can order this item</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 border-t border-gray-100 bg-white shrink-0 mt-auto">
                        <GradientButton label='Save Changes' className='w-full py-3.5 md:py-4 text-base' onClick={() => setUpdate(true)} />
                    </div>
                  </form>
                </div>
            )
            : (
              <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 md:p-8 w-full max-w-[90vw] md:max-w-[400px] text-center rounded-3xl relative shadow-2xl">
                <div onClick={() => setUpdate(false)} className='absolute top-4 right-4 bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors'>
                    <X className="text-gray-600" size={18} />
                </div>
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EllipsisVertical className="text-[#F67D26]" size={24} />
                </div>
                <p className='mb-2 text-xl font-bold text-[#101828]'>Update Item?</p>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to commit your changes to <span className="font-bold text-gray-900">{menu.name}</span>?</p>
                
                <div className='flex flex-col gap-3'>
                  <GradientButton 
                    label={isSaving ? 'Updating...' : 'Yes, update item'} 
                    className='w-full py-3.5' 
                    disabled={isSaving}
                    onClick={handleUpdate} 
                  />
                  <div 
                    onClick={() => setUpdate(false)}
                    className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </div>
                </div>
              </div>
            )
          }
        </Modal>
      )}
    </>
  )
}