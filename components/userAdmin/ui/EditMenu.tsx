'use client'

import { EllipsisVertical, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Switch from './Switch'
import { GradientButton } from './Buttons'
import { Modal } from '../screen/Modal'
import { MenuItem } from '@/types/MenuItemType'
import { useToast } from '@/context/ToastContext'

interface EditMenuProps {
  menu: MenuItem;
  branchId: string;
  onSuccess: () => void;
}

export const EditMenu = ({ menu, branchId, onSuccess }: EditMenuProps) => {
  const { showToast } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  
  // Loading states
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely extract the ID (handles both populated objects and raw strings)
  const getSafeCategoryId = () => {
    if (!menu.categoryId) return '';
    if (typeof menu.categoryId === 'object' && '_id' in menu.categoryId) {
        return menu.categoryId._id;
    }
    return menu.categoryId as string;
  };

  const [categories, setCategories] = useState<any[]>([]);
  
  // Form states initialized safely!
  const [formData, setFormData] = useState({
    name: menu.name || '',
    description: menu.description || '',
    price: menu.price || '',
    categoryId: getSafeCategoryId(), // <-- Uses the ID so the <select> element works!
    isAvailable: menu.isAvailable || false
  });


  useEffect(() => {
      setFormData({
          name: menu.name || '',
          description: menu.description || '',
          price: menu.price || '',
          categoryId: getSafeCategoryId(), // <-- Keeps it synced
          isAvailable: menu.isAvailable || false 
      });
  }, [menu]);

  // Fetch categories when the modal opens
  useEffect(() => {
    if (openEdit && categories.length === 0) {
      const fetchCategories = async () => {
        setIsCategoriesLoading(true);
        try {
          const res = await fetch(`/api/user-admin/menu/${branchId}/category`);
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

  // Prevent background scroll when modal is open
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

  // PATCH Request to save changes
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
        showToast("Please fill in all required fields", "error");
        setUpdate(false); // Go back to form
        return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/item`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: menu._id,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          categoryId: formData.categoryId, 
          isAvailable: formData.isAvailable
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      showToast("Item updated successfully", "success");
      setUpdate(false);
      setOpenEdit(false);
      onSuccess(); 

    } catch (error: any) {
      showToast(error.message || "Failed to update item", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // DELETE Request
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/user-admin/menu/${branchId}/item?itemId=${menu._id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        showToast("Item deleted!", "success");
        setOpenEdit(false);
        onSuccess(); // Refresh the table!
    } catch (error: any) {
        showToast(error.message, "error");
    } finally {
        setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <div onClick={() => setOpenEdit(true)} className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors">
        <EllipsisVertical size={20} color="#667085" />
      </div>

      {/* Modal */}
      {openEdit && (
        <Modal center={update} onClick={() => {
            setOpenEdit(false);
            setUpdate(false);
        }}>
          {
            !update ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50 py-5 px-6 w-140 h-full max-h-screen flex flex-col overflow-y-auto no-scrollbar"
                >
                  {/* header */}
                  <div className='flex justify-between mb-8 shrink-0'>
                    <div>
                      <p className='text-[#727272] text-sm'>Product details</p>
                      <p className='text-2xl font-medium text-[#101828]'>{menu.name}</p>
                    </div>
                    <div className='flex justify-between items-center gap-3'>
                      {/* Close Button */}
                      <div onClick={() => setOpenEdit(false)} className='bg-[#f67d260e] p-2 rounded-full cursor-pointer hover:bg-[#f67d2620]'>
                        <X color='#F67D26' size={20} />
                      </div>
                      {/* Delete Button */}
                      <div onClick={handleDelete} className={`bg-[#f0443815] p-2 rounded-full transition-colors ${isDeleting ? 'animate-pulse pointer-events-none' : 'cursor-pointer hover:bg-[#f0443830]'}`}>
                        <Trash2 color='#F04438' size={20} />
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 shrink-0">See details of your item here. You can edit item as required.</p>

                  {/* Form */}
                  <form className='flex flex-col flex-1' onSubmit={(e) => e.preventDefault()}>
                    <div className="flex-1">
                      <div className='mb-4'>
                        <label className='text-sm font-medium text-[#344054] mb-1 block'>Name of item</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className='border-[#D0D5DD] border w-full p-2 text-[#101828] rounded-lg focus:outline-0 focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]' />
                      </div>

                      <div className='mb-4'>
                        <label className='text-sm font-medium text-[#344054] mb-1 block'>Category</label>
                        {isCategoriesLoading ? (
                           <p className="text-sm text-gray-400 p-2 border border-gray-200 rounded-lg animate-pulse">Loading categories...</p>
                        ) : (
                          <select 
                            name="categoryId" 
                            value={formData.categoryId} 
                            onChange={handleChange}
                            className="w-full border border-[#D0D5DD] rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] cursor-pointer"
                          >
                            <option value="" disabled>Select a category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className='mb-4'>
                        <label className='text-sm font-medium text-[#344054] mb-1 block'>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className='border-[#D0D5DD] border w-full h-25 p-2 text-[#101828] rounded-lg focus:outline-0 focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]' />
                      </div>

                      <div className='mb-4'>
                        <label className='text-sm font-medium text-[#344054] mb-1 block'>Price (₦)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className='border-[#D0D5DD] border w-full p-2 text-[#101828] rounded-lg focus:outline-0 focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]' />
                      </div>

                      <div className='flex items-center gap-2 mb-6'>
                        <Switch enabled={formData.isAvailable} onClick={handleToggle} />
                        <p className="text-sm text-[#344054]">Item is available</p>
                      </div>
                    </div>

                    <div className="pt-4 shrink-0 mt-auto">
                        <GradientButton label='Proceed to save' className='w-full' onClick={() => setUpdate(true)} />
                    </div>
                  </form>
                </div>
            )
            : (
              <div onClick={(e) => e.stopPropagation()} className="bg-white py-10 px-6 w-140 h-fit text-center rounded-3xl relative">
                <div onClick={() => setUpdate(false)} className='flex absolute top-5 right-6 bg-[#f67d2622] w-fit p-1 rounded-full cursor-pointer hover:bg-[#f67d2640]'>
                    <X color="#F67D26" size={20} />
                </div>
                <p className='mb-2 text-2xl font-medium text-[#101828]'>Update item?</p>
                <p className="text-[#667085] mb-8">Are you sure you want to commit your changes to <span className="font-semibold text-gray-800">{menu.name}</span>?</p>
                <div className='flex flex-col gap-3'>
                  <GradientButton 
                    label={isSaving ? 'Updating...' : 'Yes, update item'} 
                    className='w-full' 
                    disabled={isSaving}
                    onClick={handleUpdate} 
                  />
                  <div 
                    onClick={() => setUpdate(false)}
                    className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
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