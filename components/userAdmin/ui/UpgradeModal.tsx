'use client'

import { X, Rocket, CheckCircle2 } from "lucide-react";
import { GradientButton } from "./Buttons";

interface UpgradeModalProps {
    closeModal: () => void;
    title: string;
    message: string;
    actionLabel: string;
    onAction: () => void;
}

export default function UpgradeModal({ 
    closeModal, 
    title, 
    message, 
    actionLabel, 
    onAction 
}: UpgradeModalProps) {
    return (
        <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-[90vw] max-w-md bg-white rounded-3xl relative overflow-hidden shadow-2xl"
        >
            {/* Header / Close Button */}
            <div className="absolute top-4 right-4 z-10">
                <div 
                    onClick={closeModal} 
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex justify-center items-center cursor-pointer transition-colors"
                >
                    <X size={18} className="text-gray-600" />
                </div>
            </div>

            {/* Top Banner Area */}
            <div className="bg-gradient-to-br from-[#F67D26]/10 to-[#F67D26]/5 px-6 pt-10 pb-6 flex flex-col items-center border-b border-[#F67D26]/20">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#F67D26]/20 flex items-center justify-center mb-4">
                    <Rocket size={32} className="text-[#F67D26]" />
                </div>
                <h3 className="text-xl font-bold text-[#101828] text-center mb-2">
                    {title}
                </h3>
                <p className="text-[#475467] text-sm text-center leading-relaxed">
                    {message}
                </p>
            </div>

            {/* Selling Points (The Hook) */}
            <div className="px-8 py-6 bg-white">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Unlock Premium Features
                </p>
                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#68A544] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#344054]">Add <strong className="text-gray-900">unlimited</strong> menu items and categories.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#68A544] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#344054]">Live <strong>Kitchen Display System</strong> for faster prep.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#68A544] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#344054]">Detailed <strong>analytics and sales</strong> tracking.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <GradientButton 
                        onClick={() => {
                            closeModal(); // Close modal before routing to prevent layout shifts
                            onAction();
                        }} 
                        label={actionLabel} 
                        className="w-full py-3"
                    />
                    <button 
                        onClick={closeModal}
                        className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-50"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}