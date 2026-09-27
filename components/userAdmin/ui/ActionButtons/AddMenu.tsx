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

    const isBasicPlan = !branch?.plans?.planType || branch?.plans?.planType === 'basic';
    const limitReached = isBasicPlan && totalItemCount >= 25;

    return (
        <>
            {limitReached ? (
                <div 
                    onClick={() => setShowUpgradeModal(true)} 
                    className="flex items-center gap-1 sm:gap-2 bg-orange-50 text-[#F67D26] border-[#F67D26] hover:bg-orange-100 transition-colors border rounded-xl text-xs sm:text-sm px-3 sm:px-6 py-2 cursor-pointer font-medium whitespace-nowrap"
                >
                    <Rocket size={16} /> 
                    <span className="hidden sm:inline">Upgrade to Add More</span>
                    <span className="sm:hidden">Upgrade</span>
                </div>
            ) : (
                <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 bg-[#68A544] text-white hover:bg-[#5a8e3b] transition-colors rounded-xl text-xs sm:text-sm px-3 sm:px-6 py-2 cursor-pointer font-medium whitespace-nowrap shadow-sm">
                    <Plus size={18} /> Add item
                </div>
            )}

            {openModal && (
                <Modal center={true} onClick={() => setOpenModal(false)} >
                    <div className="w-full max-w-[95vw] md:max-w-2xl max-h-[90svh] overflow-y-auto no-scrollbar rounded-2xl bg-white">
                        <AddItemsForm 
                            closeModal={closeModal} 
                            onSuccess={closeModal} 
                            branchId={branchId} 
                            onUpgradeRequired={() => {
                                setOpenModal(false);
                                setShowUpgradeModal(true);
                            }}
                        />
                    </div>
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
                            onAction={() => {
                                setShowUpgradeModal(false);
                                router.push(`/dashboard/${branch?.slug}/billing`);
                            }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
}