'use client'
import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../screen/Modal";
import Switch from "../Switch";
import { GradientButton } from "../Buttons";
import AddItemsForm from "../forms/AddItemsForm";


interface MenuState {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  isEnable: boolean;
}


export function AddMenu({branchId}: {branchId: string}){
    const [openModal, setOpenModal] = useState(false)
  
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

    const closeModal = () => {
        setOpenModal(false)
    }


    return(
        <>
        <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer"><Plus size={20} /> Add item</div>

        {
            openModal && (
            <Modal center={true} onClick={() => setOpenModal(false)} >
                <AddItemsForm closeModal={closeModal} onSuccess={closeModal} branchId={branchId} />
            </Modal>
            )
        }
        
        </>
        
    )
}