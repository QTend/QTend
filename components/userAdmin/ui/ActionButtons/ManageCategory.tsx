'use client'
import { ChevronDown, ChevronRight, Pencil, Plus, Trash, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../../screen/Modal";
import Switch from "../Switch";
import { GradientButton } from "../Buttons";
import { useToast } from "@/context/ToastContext";
import { CategoryProps } from "@/types/MenuCategoyType";

export function ManageCategory({ branchId }: { branchId: string }) {
  const router = useRouter();
  const {showToast} = useToast()
  const [openModal, setOpenModal] = useState(false);
  const [isdelete, setIsDelete] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false)

  const [categories, setCategories] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(true)

  // New states for adding a category
  const [name, setName] = useState('');
  const [categoryEnabled, setCategoryEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent background scroll when modal is open
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


  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category`)
      const data = await res.json();

       if (!res.ok) {
        showToast(data.error, "error")
        throw new Error(data.error || 'Failed to add category');
      }

      setCategories(data.categories || [])
    } catch (error: any) {
      showToast(error.message || 'Something went wrong', 'error')
    }finally{
      setCategoryLoad(false)
    }
  }

  useEffect(() => {
 fetchCategories()
  },[])

 

  // Handle API submission
  const handleSaveCategory = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/user-admin/menu/${branchId}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, isAvailable: categoryEnabled }), // branchId is no longer needed here
});

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error")
        throw new Error(data.error || 'Failed to add category');
      }

      setName('');
      showToast(data.message, "success")
      setAddCategory(false);
      router.refresh(); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer">
        Manage category
      </div>

      {/* Modal */}
      {openModal && (
        <Modal center={isdelete} onClick={() => setOpenModal(prev => !prev)}>
          {!isdelete ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white z-50 w-140 h-full max-h-screen flex flex-col justify-between pb-5"
            >
              <div>
                <div className="px-6 py-5 flex justify-between items-center">
                  <p className="font-medium text-2xl ">{categoryMenu ? 'Main course meals' : 'Manage categories' }  </p>
                  {addCategory && (
                    <p onClick={() => {
                        setAddCategory(false);
                        setError(''); 
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


                {/* second layer */}
                  <div className="flex justify-between items-center border border-[#F0F0F0] py-5 px-6">
                  {
                  !addCategory && !categoryMenu ? (
                    <>
                    <p className="text-lg font-medium">Existing categories</p>
                    <button onClick={() => setAddCategory(true)} className="bg-[#68A544] rounded-xl px-5 py-2 text-white text-sm">
                      Add new category
                    </button>
                    </>
                    )
                    : (
                      <div className="flex items-center gap-1 text-sm">
                        <p onClick={() => setAddCategory(false) ?? setCategoryMenu(false)} className="text-[#68A544] underline cursor-pointer" >Manage categories</p>
                        <ChevronRight size={16} />
                        <p>
                          {addCategory ? 'Add new category' : 'Main course meals' }
                        </p>
                      </div>
                    )
                  }
                  
                  </div>
                  


                {/* List and Form */}
                {addCategory ? (
                  <div className="px-6 pt-5 border-t border-t-[#F0F0F0] flex-col">
                    <div>
                      <p className="text-[#344054] text-sm">Name of category </p>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter name of category"
                        className='border-[#D0D5DD] mt-2 mb-1 border w-full p-2 text-[#101828] text-lg bg-[#F2F4F7] rounded-lg focus:outline-0' 
                      />
                      {/* Error Display */}
                      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                      <div className="flex items-center gap-1 mt-3">
                        <Switch enabled={categoryEnabled} onClick={() => setCategoryEnabled(prev => !prev)} />
                        <p className="text-sm">item is availble</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <GradientButton 
                        label={isLoading ? 'Saving...' : 'Save'} 
                        className='w-full' 
                        onClick={handleSaveCategory} 
                        disabled={isLoading || !name.trim()} 
                      />
                    </div>
                  </div>
                ) : (
                  categoryMenu 
                  ? (
                  <div className='mt-3 h-full px-6'>
                    <div className="bg-[#ffe58f89] border-[#FFE58F] border p-2 mb-5">
                      <p className="text-xs leading-5">All items under a category would be permanently deleted from your menu if the category is deleted. Similarly, items under a category would not be visible if the category visibility is turned off</p>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <p className="text-base">Jollof rice and chicken</p>
                      <Trash color={'#667085'} />
                    </div>
                  </div>
                  )
                  : (
                  <div className='mt-5 h-full px-6'>
                    {
                      categories.map((c: CategoryProps) => (
                        <div key={c._id} className="flex justify-between items-center mb-3">
                          <div onClick={() => setCategoryMenu(true)} className="flex cursor-pointer items-center gap-3">
                            <p className="text-lg">{c.name}</p>
                            <ChevronRight color={'#F67D26'} />
                          </div>
                          <Switch enabled={c.isAvailable} onClick={() => {}} bgOn={'bg-[#217457]'}/>
                        </div>
                      ))
                    }
                    
                  </div>
                  )
                )}
              </div>
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
                  onClick={() => setIsDelete(false)}
                  className="w-full mb-2 p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-al bg-[#F04438] text-white"
                >
                  Yes delete category
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}