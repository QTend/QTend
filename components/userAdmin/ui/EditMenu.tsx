'use client'

import { EllipsisVertical, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Switch from './Switch'
import Button from '@/components/customer/ui/Button'
import { GradientButton } from './Buttons'
import { Modal } from '../screen/Modal'

export const EditMenu = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [update, setUpdate] = useState(false)

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (openEdit) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [openEdit])

  return (
    <>
      {/* Trigger button */}
      <div onClick={() => setOpenEdit(true)}>
        <EllipsisVertical />
      </div>

      {/* Modal */}
      {openEdit && (
        <Modal center={update} onClick={() => setOpenEdit(prev => !prev)}>
          {
            !update ? (
        
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white z-50 py-5 px-6 w-140 h-full max-h-screen flex flex-col"
                >
                  {/* header */}
                  <div className='flex justify-between mb-10'>
                    <div>
                      <p className='text-[#727272] text-sm'>Product details</p>
                      <p className='text-2xl'>Jollof rice with chicken</p>
                    </div>
                    <div className='flex justify-between items-center gap-3'>
                      <div className='bg-[#f67d260e] p-2 rounded-full'>
                        <Pencil />
                      </div>
                      <div className='bg-[#f67d260e] p-2 rounded-full'>
                        <Trash2  color='#F04438'/>
                      </div>
                    </div>
                  </div>

                  <p>See details of your item here. You can edit item as required.</p>

                  {/* Form */}
                  <form className='mt-5 flex flex-col h-full justify-between'>
                    <div>
                      <div className='mb-3'>
                        <p className='text-sm text-[#344054] mb-1'>Name of item</p>
                        <input type="text" className='border-[#D0D5DD] border w-full p-2 text-[#101828] rounded-lg focus:outline-0' />
                      </div>

                      <div className='mb-3'>
                        <p className='text-sm text-[#344054] mb-1'>Description</p>
                        <textarea  className='border-[#D0D5DD] border w-full h-25 p-2 text-[#101828] rounded-lg focus:outline-0' />
                      </div>

                      <div className='mb-3'>
                        <p className='text-sm text-[#344054] mb-1'>Price</p>
                        <input type="text" className='border-[#D0D5DD] border w-full p-2 text-[#101828] rounded-lg focus:outline-0' />
                      </div>

                      <div className='flex items-center gap-1 mb-3'>
                        <Switch enabled={true} onClick={() => {}} />
                        <p>items is available</p>
                      </div>
                    </div>

                      <GradientButton label='Proceed to save'className='w-full' onClick={() => setUpdate(true)} />
                  </form>
                </div>
              
            )
            : (
              <div onClick={(e) => e.stopPropagation()} className="bg-white py-10 px-6 w-140 h-fit text-center rounded-3xl relative">
                <div className='flex absolute top-5 right-6 bg-[#f67d2622] w-fit p-1 rounded-full'><X /></div>
                <p className='mb-2 text-2xl'>Update item?</p>
                <p>You're sure you want to commit your changes to this item?</p>
                <div className='flex-cal mt-7 gap-5'>
                  <GradientButton label='Yes, cancel' className='w-full mb-2' type='button' onClick={() => setUpdate(false)} />
                  <GradientButton label='Cancel' variant='outline' type='button'  className='w-full' onClick={() => setUpdate(false)} />
                </div>
              </div>
            )
          }
        </Modal>
      )  }

      
    </>
  )
}