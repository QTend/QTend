'use client'
import { Plus, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../screen/Modal";
import AddItemsForm from "../forms/AddItemsForm";
import { useUserAdmin } from "@/context/UserAdminContext";
import { useRouter } from "next/navigation";
import { useMenuItem } from "@/context/MenuItemContext";
import UpgradeModal from "../UpgradeModal";

export function AddMenu({ branchId }: { branchId: string }) {
    const [openModal, setOpenModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false); 

    const { branch } = useUserAdmin();
    const { totalItemCount } = useMenuItem();
    const router = useRouter();
  
    useEffect(() => {
        if (openModal || showUpgradeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [openModal, showUpgradeModal]);

    const closeModal = () => setOpenModal(false);

    // 🚀 Basic Plan & 30-Item Check
    const isBasicPlan = !branch?.plans?.planType || branch?.plans?.planType === 'basic';
    const limitReached = isBasicPlan && totalItemCount >= 15;

    return (
        <>
            {/* Unified Button Rendering based on limitReached */}
            {limitReached ? (
                <div 
                    onClick={() => setShowUpgradeModal(true)} 
                    className="flex items-center gap-2 bg-[#F67D26]/10 text-[#F67D26] border-[#F67D26] hover:bg-[#F67D26]/20 transition-colors border rounded-xl text-sm px-6 py-2 cursor-pointer font-medium"
                >
                    <Rocket size={18} /> 
                    Upgrade to Add More
                </div>
            ) : (
                <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] hover:bg-[#68A544]/5 transition-colors border rounded-xl text-sm px-6 py-1 cursor-pointer font-medium">
                    <Plus size={20} /> Add item
                </div>
            )}

            {/* Form Modal */}
            {openModal && (
                <Modal center={true} onClick={() => setOpenModal(false)} >
                    <AddItemsForm 
                        closeModal={closeModal} 
                        onSuccess={closeModal} 
                        branchId={branchId} 
                        onUpgradeRequired={() => {
                            setOpenModal(false);
                            setShowUpgradeModal(true);
                        }}
                    />
                </Modal>
            )}

            {/* Upgrade Modal now mounts perfectly because it's always part of the output tree */}
            {showUpgradeModal && (
                <Modal center={true} onClick={() => setShowUpgradeModal(false)}>
                    <UpgradeModal 
                        closeModal={() => setShowUpgradeModal(false)}
                        title="Basic Tier Limit Reached"
                        message="You've reached the 30-item limit on the Basic plan. Upgrade to Starter for unlimited items, live order tracking, and more."
                        actionLabel="View Pricing Plans"
                        onAction={() => {
                            setShowUpgradeModal(false);
                            router.push(`/dashboard/${branch?.slug}/billing`);
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
