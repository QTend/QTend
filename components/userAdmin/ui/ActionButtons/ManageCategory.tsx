'use client'
import { ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../screen/Modal";
import Switch from "../Switch";
import { GradientButton } from "../Buttons";


interface MenuState {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  isEnable: boolean;
}


export function ManageCategory(){
    const [openModal, setOpenModal] = useState(false)
    const [isdelete, setIsDelete] = useState(false)
    const [addCategory, setAddCategory] = useState(false)





    // Prevent background scroll when modal is open
    useEffect(() => {
    if (openModal) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }

    // Cleanup on unmount
    return () => {
        document.body.style.overflow = 'auto'
    }
    }, [openModal])





    return(
        <>
        <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer">Manage category</div>

        {/* Modal */}
      {openModal && (
        <Modal center={isdelete} onClick={() => setOpenModal(prev => !prev)}>
          {
            !isdelete ? (
              
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50   w-140 h-full max-h-screen flex flex-col justify-between pb-5"
                >
                  <div>
                    <div className="px-6 py-5 flex justify-between items-center">
                      <p className="font-medium text-2xl ">Manage categories</p>
                      {addCategory && 
                      <p onClick={() => setAddCategory(false)} className="cursor-pointer">Cancel</p> }
                    </div>



                  {
                    !addCategory && (
                      <div className="flex justify-between items-center border border-[#F0F0F0] py-5 px-6">
                      <p className="text-lg font-medium">Existing categories</p>

                      <button onClick={() => setAddCategory(true)} className="bg-[#68A544] rounded-xl px-5 py-2 text-white text-sm">Add new category</button>
                      </div>
                    )
                  }
                  
                  

                  {/*list and Form */}
                  {
                    addCategory 
                    ? (
                      <div className="px-6 pt-5 border-t border-t-[#F0F0F0]">
                        <p>Name of category </p>
                         <input type="text" className='border-[#D0D5DD] mt-2 mb-3 border w-full p-2 text-[#101828] text-lg bg-[#F2F4F7] rounded-lg focus:outline-0' />

                         
                          <div className="flex items-center gap-1">
                            <Switch enabled={true} onClick={() => {}}/>
                            <p className="text-sm">item is availble</p>
                          </div>
                      </div>
                    )
                    :(
                        <div className='mt-5  h-full justify-between px-6'>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                      <p className="text-lg">Soups & Stews</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch enabled={true} onClick={() => {}} />
                        <Trash2 color="red" onClick={() => setIsDelete(true)} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg">Soups & Stews</p>
                      <Switch enabled={true} onClick={() => {}} />
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg">Soups & Stews</p>
                      <Switch enabled={true} onClick={() => {}} />
                    </div>
                  </div>
                    )
                  }
                  </div>
                  


                  <div className="px-6">
                  <GradientButton label='Proceed to save'className='w-full' onClick={() => {}} />
                  </div>
                  
                </div>
            )
            : (
              <div onClick={(e) => e.stopPropagation()} className="bg-white py-10 px-6 w-140 h-fit text-center rounded-3xl relative">
                <div className='flex absolute top-5 right-6 bg-[#f67d2622] w-fit p-1 rounded-full'><X /></div>
                <p className='mb-2 text-2xl font-medium font'>Delete item category?</p>
                <p>Are you certain? <br />All items in the category will be permanently deleted from your menu</p>
                <div className='flex-cal mt-7 gap-5'>
                    <button 
                    onClick={() => setIsDelete(false)}
                    className="w-full mb-2 p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-al bg-[#F04438] text-white">
                      Yes delete category
                      </button>
                </div>
              </div>
            )
          }
        </Modal>
      )  }
        
        </>
        
    )
}