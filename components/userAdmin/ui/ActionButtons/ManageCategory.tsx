'use client'
import { ChevronDown, ChevronRight, Pencil, Plus, Trash, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../screen/Modal";
import Switch from "../Switch";
import { GradientButton, PlainButton } from "../Buttons";
import { useToast } from "@/context/ToastContext";
import { CategoryProps } from "@/types/MenuCategoyType";
import AddItemsForm from "../forms/AddItemsForm";
import { MenuItem } from "@/types/MenuItemType";
import { useMenuItem } from "@/context/MenuItemContext";
import { useCategory } from "@/context/CategoryContext";

export function ManageCategory({ branchId }: { branchId: string }) {
  const { showToast } = useToast()
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false)
  const [isdelete, setIsDelete] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const [categoryMenuItems, setCategoryMenusItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<any>({})

  const [name, setName] = useState('');
  const [categoryEnabled, setCategoryEnabled] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  
  const { refreshMenuItems } = useMenuItem()
      const {refreshCategories, categories} = useCategory()

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);


  const fetchCategoryItems = async (categoryId: string) => {
    setIsItemsLoading(true);
    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/item?categoryId=${categoryId}`);
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error");
        throw new Error(data.error || 'Failed to fetch items');
      }

      setCategoryMenusItems(data.items || []); 
    } catch (error: any) {
      showToast(error.message || 'Something went wrong fetching items', 'error');
    } finally {
      setIsItemsLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories()
  }, [])

  const handleSaveCategory = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isAvailable: categoryEnabled }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error")
        throw new Error(data.error || 'Failed to add category');
      }

      setName('');
      showToast(data.message, "success")
      setAddCategory(false);
      await refreshCategories()

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory._id) return;

    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category?categoryId=${selectedCategory._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error")
        throw new Error(data.error || 'Failed to delete category');
      }

      showToast(data.message, "success");
      await refreshCategories();
      setAddCategory(false);
      setIsDelete(false);
      setCategoryMenu(false); 

    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  const handleEdit = async () => {
    if (!selectedCategory._id || !name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categoryId: selectedCategory._id, 
          name, 
          isAvailable: categoryEnabled 
        }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error")
        throw new Error(data.error || 'Failed to update category');
      }

      showToast(data.message, "success");
      await refreshMenuItems()
      
      setAddCategory(false);
      setIsEditing(false);
      setCategoryMenu(false); 
      setName('');
      setSelectedCategory({});

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = async (category: CategoryProps) => {
    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categoryId: category._id, 
          name: category.name, 
          isAvailable: !category.isAvailable 
        }),
      });

      if (res.ok) {
        showToast("Category visibility updated", "success");
        await refreshCategories()
      } else {
        showToast("Failed to update visibility", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  }

  const handleCloseModal = async () => {
    setOpenAddModal(false)
  }

  const deleteItemFromDatabase = async (itemId: string) => {
    setDeletingItemId(itemId);
    try {
        const res = await fetch(`/api/user-admin/menu/${branchId}/item?itemId=${itemId}`, {
            method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        showToast("Item deleted!", "success");
        fetchCategoryItems(selectedCategory._id);
        await refreshMenuItems()
        
    } catch (error: any) {
        showToast(error.message, "error");
    } finally {
        setDeletingItemId(null); // 2. Stop loading when done (whether success or fail)
    }
}

  return (
    <>
      <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer">
        Manage category
      </div>

      {openModal && (
        <Modal center={isdelete || openAddModal} onClick={() => {
          setOpenModal(false);
          setIsEditing(false);
          setAddCategory(false);
          setCategoryMenu(false);
          setName('');
        }}>
          {
            openAddModal 
            ? <AddItemsForm 
                closeModal={handleCloseModal} 
                branchId={branchId}
                category={selectedCategory}
                onSuccess={() => {
                  setOpenAddModal(false);
                  fetchCategoryItems(selectedCategory._id);
                }} />
            : (
              !isdelete ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50 w-140 h-full max-h-screen flex flex-col pb-5 overflow-hidden"
                >
                  {/* Header*/}
                  <div className="px-6 py-5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-2xl ">{categoryMenu ? selectedCategory.name : 'Manage categories'}  </p>
                      {categoryMenu && (
                        <Pencil 
                          size={18} 
                          className="cursor-pointer"
                          onClick={() => {
                            setName(selectedCategory.name);
                            setCategoryEnabled(selectedCategory.isAvailable);
                            setIsEditing(true);
                            setAddCategory(true);
                            setCategoryMenu(false);
                          }} 
                        />
                      )}
                    </div>
                    {addCategory && (
                      <p onClick={() => {
                        setAddCategory(false);
                        setIsEditing(false); 
                        setError('');
                        setName('');
                      }} className="cursor-pointer text-sm">
                        Cancel
                      </p>
                    )}
                    {categoryMenu && (
                      <p onClick={() => {
                        setIsDelete(true);
                        setError('');
                      }} className="cursor-pointer text-[#F04438] text-sm">
                        Delete category
                      </p>
                    )}
                  </div>

                  {/* Sub-header */}
                  <div className="flex justify-between items-center border border-[#F0F0F0] py-5 px-6 shrink-0">
                    {
                      !addCategory && !categoryMenu ? (
                        <>
                          <p className="text-lg font-medium">Existing categories</p>
                          <button onClick={() => {
                            setName('');
                            setCategoryEnabled(true);
                            setAddCategory(true);
                          }} className="bg-[#68A544] rounded-xl px-5 py-2 text-white text-sm">
                            Add new category
                          </button>
                        </>
                      )
                      : (
                        <div className="flex items-center gap-1 text-sm">
                          <p onClick={() => { 
                            setAddCategory(false); 
                            setCategoryMenu(false);
                            setIsEditing(false);
                            setName('');
                          }} className="text-[#68A544] underline cursor-pointer" >Manage categories</p>
                          <ChevronRight size={16} />
                          <p>
                            {addCategory ? (isEditing ? 'Edit category' : 'Add new category') : selectedCategory.name}
                          </p>
                        </div>
                      )
                    }
                  </div>

                  {/* Body Content */}
                  {addCategory ? (
                    <div className="px-6 pt-5 border-t border-t-[#F0F0F0] flex flex-col flex-1 overflow-y-auto">
                      <div>
                        <p className="text-[#344054] text-sm">Name of category </p>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading}
                          placeholder="Enter name of category"
                          className='border-[#D0D5DD] mt-2 mb-1 border w-full p-2 text-[#101828] text-lg bg-[#F2F4F7] rounded-lg focus:outline-0'
                        />
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <div className="flex items-center gap-1 mt-3">
                          <Switch enabled={categoryEnabled} onClick={() => setCategoryEnabled(prev => !prev)} />
                          <p className="text-sm">item is availble</p>
                        </div>
                      </div>

                      <div className="mt-8 shrink-0">
                        <GradientButton
                          label={loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                          className='w-full'
                          onClick={isEditing ? handleEdit : handleSaveCategory}
                          disabled={loading || !name.trim()}
                        />
                      </div>
                    </div>
                  ) : categoryMenu ? (
                    <div className='mt-3 flex-1 px-6 flex flex-col h-full overflow-hidden'> 
                      {/* 1. Top Alert Box */}
                      <div className="bg-[#ffe58f89] border-[#FFE58F] border p-2 mb-5">
                        <p className="text-xs leading-5">
                          All items under a category would be permanently deleted...
                        </p>
                      </div>

                      {/* 2. Scrollable List Area - UPDATED WITH LOADING STATE */}
                      <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
                        {isItemsLoading ? (
                          <p className="text-gray-500 text-center py-10 animate-pulse">Loading items...</p>
                        ) : categoryMenuItems.length > 0 ? (
                          categoryMenuItems.map((m: any) => (
                            <div key={m._id} className="bg-[#68A54414] p-3 rounded-xl mb-3 transition-all">
                              <div className="flex justify-between items-center gap-3">
                                
                                {/* Clickable Header Area */}
                                <div 
                                  onClick={() => setExpandedItemId(expandedItemId === m._id ? null : m._id)} 
                                  className="flex items-center gap-2 cursor-pointer select-none flex-1"
                                >
                                  <p className="text-base font-medium text-[#101828]">{m.name}</p>
                                  <ChevronDown 
                                    color={'#F67D26'} 
                                    size={20} 
                                    className={`transition-transform duration-200 ${expandedItemId === m._id ? 'rotate-180' : ''}`} 
                                  />
                                </div>
                                
                                {/* Delete Action */}
                                {deletingItemId === m._id ? (
                                    <div className="shrink-0 animate-pulse">
                                      <Trash color={'#ccc'} size={18} />
                                    </div>
                                  ) : (
                                    <Trash 
                                      color={'#667085'} 
                                      size={18} 
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevents the accordion from opening when clicking trash
                                        deleteItemFromDatabase(m._id);
                                      }} 
                                      className="cursor-pointer hover:text-red-500 transition-colors shrink-0" 
                                    />
                                  )}                              
                              </div>

                              {/* Expanded Details View (Only shows if this specific item's ID matches the state) */}
                              {expandedItemId === m._id && (
                                <div className="flex gap-4 bg-white rounded-lg p-3 mt-3 shadow-sm border border-[#EAECF0]">
                                  
                                  {/* Image Placeholder (You can swap this with next/image later) */}
                                  <div className="w-14 h-14 rounded-lg bg-orange-200 shrink-0 object-cover overflow-hidden">
                                      {m.image?.url && !m.image.url.includes("temp_random") && (
                                          <img src={m.image.url} alt={m.name} className="w-full h-full object-cover" />
                                      )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    {/* Labels Row */}
                                    <div className="flex items-center gap-8 mb-2 border-b border-gray-50 pb-2">
                                      <div>
                                        <p className="text-[#667085] text-xs font-medium uppercase tracking-wider mb-0.5">Price</p>
                                        <p className="text-sm font-semibold text-[#101828]">₦ {m.price}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#667085] text-xs font-medium uppercase tracking-wider mb-0.5">Menu item</p>
                                        <p className="text-sm font-medium text-[#101828]">{m.name}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Description Row */}
                                    <div>
                                      <p className="text-[#667085] text-xs font-medium uppercase tracking-wider mb-0.5">Description</p>
                                      <p className="text-sm text-[#344054] leading-relaxed line-clamp-2">
                                        {m.description || <span className="italic text-gray-400">No description provided</span>}
                                      </p>
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-10">No items available</p>
                        )}
                      </div>

                      {/* 3. Fixed Button at the bottom */}
                      <div className="pb-6"> 
                        <PlainButton onClick={() => setOpenAddModal(true)} label="Add new item" className="bg-[#68A544] text-white w-full" />
                      </div>
                    </div>

                  ) : (
                    <div className='mt-5 flex-1 px-6 overflow-y-auto no-scrollbar pb-10'>
                      {
                        categories.map((c: CategoryProps) => (
                          <div key={c._id} className="flex justify-between items-center mb-5">
                            <div onClick={() => {
                              setSelectedCategory(c)
                              setCategoryMenu(true)
                              fetchCategoryItems(c._id);
                            }} className="flex cursor-pointer items-center gap-3">
                              <p className="text-lg">{c.name}</p>
                              <ChevronRight color={'#F67D26'} />
                            </div>
                            <Switch enabled={c.isAvailable} onClick={() => handleToggle(c)} bgOn={'bg-[#217457]'} />
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={(e) => e.stopPropagation()} className="bg-white py-10 px-6 w-140 h-fit text-center rounded-3xl relative">
                  <div onClick={() => setIsDelete(false)} className='flex absolute top-5 right-6 bg-[#f67d2622] w-fit p-1 rounded-full cursor-pointer'>
                    <X />
                  </div>
                  <p className='mb-2 text-2xl font-medium font'>Delete item category?</p>
                  <p>Are you certain? <br />All items in the category will be permanently deleted from your menu</p>
                  <div className='flex-col mt-7 gap-5'>
                    <button
                      onClick={handleDelete}
                      className="w-full mb-2 p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-al bg-[#F04438] text-white"
                    >
                      Yes delete category
                    </button>
                  </div>
                </div>
              )
            )
          }

          
        </Modal>
      )}
    </>
  );
}