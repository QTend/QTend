'use client'
import { ChevronDown, ChevronRight, Pencil, Trash, X } from "lucide-react";
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
import { useSearchParams, useRouter } from "next/navigation";
import { useUserAdmin } from "@/context/UserAdminContext";
import UpgradeModal from "../UpgradeModal"; 

export function ManageCategory({ branchId, branchSlug }: { branchId: string, branchSlug: string }) {
  const { showToast } = useToast()
  const searchParams = useSearchParams(); 
  const router = useRouter();
  
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); 
  
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
  
  const { refreshMenuItems, totalItemCount } = useMenuItem(); 
  const { refreshCategories, categories } = useCategory();
  const { branch } = useUserAdmin(); 

  const isBasicPlan = !branch?.plans?.planType || branch.plans.planType === 'basic';
  const limitReached = isBasicPlan && totalItemCount >= 30;

  useEffect(() => {
    if (searchParams.get("modal") === "new-category") {
      setOpenModal(true);
      setAddCategory(true); 
      router.replace(`/dashboard/${branchSlug}/menu`, { scroll: false }); 
    }
  }, [searchParams, branchId, router]);

  useEffect(() => {
    if (openModal || showUpgradeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal, showUpgradeModal]);

  const fetchCategoryItems = async (categoryId: string) => {
    setIsItemsLoading(true);
    try {
      const res = await fetch(`/api/user-admin/${branchId}/menu/item?categoryId=${categoryId}&limit=10000`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch items');
      setCategoryMenusItems(data.items || []); 
    } catch (error: any) {
      showToast(error.message || 'Something went wrong fetching items', 'error');
    } finally {
      setIsItemsLoading(false);
    }
  };

  useEffect(() => { refreshCategories() }, [])

  const handleSaveCategory = async () => { /* Original logic */
    if (!name.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/user-admin/${branchId}/menu/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isAvailable: categoryEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');
      setName(''); showToast(data.message, "success"); setAddCategory(false); await refreshCategories();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDelete = async () => { /* Original logic */
    if (!selectedCategory._id) return;
    try {
      const res = await fetch(`/api/user-admin/${branchId}/menu/category?categoryId=${selectedCategory._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');
      showToast(data.message, "success"); await refreshCategories(); setAddCategory(false); setIsDelete(false); setCategoryMenu(false); 
    } catch (error: any) { showToast(error.message, "error") }
  }

  const handleEdit = async () => { /* Original logic */
    if (!selectedCategory._id || !name.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/user-admin/${branchId}/menu/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedCategory._id, name, isAvailable: categoryEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update category');
      showToast(data.message, "success"); refreshMenuItems(); refreshCategories();
      setAddCategory(false); setIsEditing(false); setCategoryMenu(false); setName(''); setSelectedCategory({});
    } catch (error: any) { setError(error.message); } finally { setLoading(false); }
  }

  const handleToggle = async (category: CategoryProps) => { /* Original logic */
    try {
      const res = await fetch(`/api/user-admin/${branchId}/menu/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: category._id, name: category.name, isAvailable: !category.isAvailable }),
      });
      if (res.ok) { showToast("Category visibility updated", "success"); await refreshCategories() } 
      else { showToast("Failed to update visibility", "error"); }
    } catch (error) { showToast("Something went wrong", "error"); }
  }

  const deleteItemFromDatabase = async (itemId: string) => { /* Original logic */
    setDeletingItemId(itemId);
    try {
        const res = await fetch(`/api/user-admin/${branchId}/menu/item?itemId=${itemId}`, { method: 'DELETE', });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast("Item deleted!", "success"); fetchCategoryItems(selectedCategory?._id); refreshMenuItems();
    } catch (error: any) { showToast(error.message, "error"); } finally { setDeletingItemId(null); }
  }

  return (
    <>
      <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 border rounded-xl text-xs sm:text-sm px-3 sm:px-6 py-2 cursor-pointer font-medium whitespace-nowrap shadow-sm">
        Manage categories
      </div>

      {openModal && (
        <Modal center={isdelete || openAddModal} onClick={() => {
          setOpenModal(false); setIsEditing(false); setAddCategory(false); setCategoryMenu(false); setName('');
        }}>
          {
            openAddModal 
            ? (
                <div className="w-full max-w-[95vw] md:max-w-2xl max-h-[90svh] overflow-y-auto no-scrollbar rounded-2xl bg-white">
                    <AddItemsForm 
                        closeModal={() => setOpenAddModal(false)} 
                        branchId={branchId}
                        category={selectedCategory}
                        onUpgradeRequired={() => { setOpenAddModal(false); setShowUpgradeModal(true); }}
                        onSuccess={() => { setOpenAddModal(false); fetchCategoryItems(selectedCategory?._id); }} 
                    />
                </div>
            )
            : (
              !isdelete ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50 w-full sm:w-[560px] max-w-[95vw] h-[90svh] sm:h-full sm:max-h-[90vh] sm:rounded-2xl flex flex-col pb-5 overflow-hidden"
                >
                  <div className="px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center shrink-0 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-xl sm:text-2xl text-[#101828]">{categoryMenu ? selectedCategory.name : 'Categories'}  </p>
                      {categoryMenu && <Pencil size={18} className="cursor-pointer text-gray-400 hover:text-gray-800" onClick={() => { setName(selectedCategory.name); setCategoryEnabled(selectedCategory.isAvailable); setIsEditing(true); setAddCategory(true); setCategoryMenu(false); }} />}
                    </div>
                    {addCategory && <p onClick={() => { setAddCategory(false); setIsEditing(false); setError(''); setName(''); }} className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg">Cancel</p>}
                    {categoryMenu && <p onClick={() => { setIsDelete(true); setError(''); }} className="cursor-pointer text-[#F04438] font-medium text-sm bg-red-50 px-3 py-1.5 rounded-lg">Delete</p>}
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 py-3 px-4 sm:px-6 shrink-0 border-b border-gray-200">
                    {!addCategory && !categoryMenu ? (
                        <>
                          <p className="text-sm font-medium text-gray-600">Your menu structure</p>
                          <button onClick={() => { setName(''); setCategoryEnabled(true); setAddCategory(true); }} className="bg-[#101828] rounded-lg px-4 py-1.5 text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-black transition-colors">
                            + Add category
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <p onClick={() => { setAddCategory(false); setCategoryMenu(false); setIsEditing(false); setName(''); }} className="text-gray-500 hover:text-gray-900 cursor-pointer" >Categories</p>
                          <ChevronRight size={14} className="text-gray-400" />
                          <p className="font-medium text-[#101828]">{addCategory ? (isEditing ? 'Edit category' : 'New category') : selectedCategory.name}</p>
                        </div>
                      )}
                  </div>

                  {addCategory ? (
                    <div className="px-4 sm:px-6 pt-5 flex flex-col flex-1 overflow-y-auto">
                      <div>
                        <p className="text-[#344054] text-sm font-medium">Category Name</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} placeholder="e.g. Starters, Drinks" className='border-[#D0D5DD] mt-2 mb-1 border w-full p-3 text-[#101828] text-base bg-white rounded-xl focus:outline-none focus:border-[#68A544] focus:ring-1 focus:ring-[#68A544]' />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <div className="flex items-center gap-3 mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <Switch enabled={categoryEnabled} onClick={() => setCategoryEnabled(prev => !prev)} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Make visible on menu</p>
                            <p className="text-xs text-gray-500">Customers can see and order from this category</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 shrink-0 pb-6 sm:pb-0">
                        <GradientButton label={loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category')} className='w-full py-4 text-base' onClick={isEditing ? handleEdit : handleSaveCategory} disabled={loading || !name.trim()} />
                      </div>
                    </div>
                  ) : categoryMenu ? (
                    <div className='mt-3 flex-1 px-4 sm:px-6 flex flex-col h-full overflow-hidden'> 
                      <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-4">
                        <p className="text-xs text-red-700 leading-relaxed font-medium">Warning: Deleting this category will permanently delete all menu items inside it.</p>
                      </div>
                      <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
                        {isItemsLoading ? (
                          <p className="text-gray-500 text-center py-10 animate-pulse text-sm">Loading items...</p>
                        ) : categoryMenuItems.length > 0 ? (
                          categoryMenuItems.map((m: any) => (
                            <div key={m._id} className="bg-white border border-gray-100 shadow-sm p-3 rounded-xl mb-3 transition-all">
                              <div className="flex justify-between items-center gap-3">
                                <div onClick={() => setExpandedItemId(expandedItemId === m._id ? null : m._id)} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                  <p className="text-sm sm:text-base font-bold text-[#101828]">{m.name}</p>
                                  <ChevronDown color={'#F67D26'} size={18} className={`transition-transform duration-200 ${expandedItemId === m._id ? 'rotate-180' : ''}`} />
                                </div>
                                {deletingItemId === m._id ? <div className="shrink-0 animate-pulse"><Trash color={'#ccc'} size={16} /></div> : <Trash color={'#98A2B3'} size={16} onClick={(e) => { e.stopPropagation(); deleteItemFromDatabase(m._id); }} className="cursor-pointer hover:text-red-500 transition-colors shrink-0" />}                              
                              </div>
                              {expandedItemId === m._id && (
                                <div className="flex gap-3 bg-gray-50 rounded-lg p-3 mt-3 border border-gray-100">
                                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                                      {m.image?.url && !m.image.url.includes("temp_random") && <img src={m.image.url} alt={m.name} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <p className="text-xs font-bold text-[#F67D26]">₦ {m.price}</p>
                                    </div>
                                    <p className="text-xs text-[#667085] leading-relaxed line-clamp-2">{m.description || <span className="italic text-gray-400">No description provided</span>}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-gray-500 text-sm mb-2">No items in this category yet.</p>
                          </div>
                        )}
                      </div>
                      <div className="pb-6 sm:pb-4 shrink-0"> 
                        {limitReached ? <PlainButton onClick={() => setShowUpgradeModal(true)} label="Upgrade to Add More Items" className="bg-[#F67D26] text-white w-full py-3 sm:py-4" /> : <PlainButton onClick={() => setOpenAddModal(true)} label="+ Add item to category" className="bg-[#101828] hover:bg-black text-white w-full py-3 sm:py-4 shadow-sm" />}
                      </div>
                    </div>
                  ) : (
                    <div className='mt-2 flex-1 px-4 sm:px-6 overflow-y-auto no-scrollbar pb-10'>
                      {categories.map((c: CategoryProps) => (
                        <div key={c._id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-none">
                          <div onClick={() => { setSelectedCategory(c); setCategoryMenu(true); fetchCategoryItems(c?._id); }} className="flex cursor-pointer items-center gap-2 group">
                            <p className="text-base font-medium text-[#101828] group-hover:text-[#F67D26] transition-colors">{c.name}</p>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#F67D26] transition-colors" />
                          </div>
                          <Switch enabled={c.isAvailable} onClick={() => handleToggle(c)} bgOn={'bg-[#68A544]'} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 sm:p-8 w-full max-w-[90vw] sm:w-[400px] text-center rounded-3xl relative">
                  <div onClick={() => setIsDelete(false)} className='absolute top-4 right-4 bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors'>
                    <X size={16} className="text-gray-600" />
                  </div>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash className="text-red-600" size={24} />
                  </div>
                  <p className='mb-2 text-xl font-bold text-gray-900'>Delete Category?</p>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">Are you certain? All menu items within this category will be permanently deleted. This action cannot be undone.</p>
                  <button onClick={handleDelete} className="w-full mb-3 p-3.5 rounded-xl font-bold bg-[#F04438] hover:bg-red-700 text-white transition-colors">Yes, delete everything</button>
                  <button onClick={() => setIsDelete(false)} className="w-full p-3.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              )
            )
          }
        </Modal>
      )}

      {showUpgradeModal && (
        <Modal center={true} onClick={() => setShowUpgradeModal(false)}>
          <div className="w-full max-w-[95vw] md:max-w-md">
            <UpgradeModal 
                closeModal={() => setShowUpgradeModal(false)}
                title="Basic Tier Limit Reached"
                message="You've reached the 30-item limit on the Basic plan. Upgrade to Starter for unlimited items, live order tracking, and more."
                actionLabel="View Pricing Plans"
                onAction={() => { setShowUpgradeModal(false); setOpenModal(false); router.push(`/dashboard/${branchSlug}/billing`); }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}