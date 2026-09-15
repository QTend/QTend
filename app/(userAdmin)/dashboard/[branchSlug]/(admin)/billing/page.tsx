'use client'

import { useState } from "react";
import { CheckCircle2, Rocket, Star } from "lucide-react";
import { useUserAdmin } from "@/context/UserAdminContext";
import { useToast } from "@/context/ToastContext";
import { pricingData } from "@/constant/pricingData";

export default function BillingPage() {
    const { branch } = useUserAdmin();
    const { showToast } = useToast();
    const [isAnnual, setIsAnnual] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

    const handleSubscribe = async (planId: number) => {
        if (!branch?._id) return;
        
        setLoadingPlan(planId);
        try {
            // Call our simulator API
            const res = await fetch(`/api/user-admin/${branch?._id}/billing/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId })
            });

            const data = await res.json();

            if (res.ok) {
                showToast("Payment successful! Plan activated.", "success");
                
                // 🚀 FORCE REFRESH: We redirect them to the dashboard so `layout.tsx` re-runs, 
                // sees the new expiryDate, and lifts the blur lock completely!
                window.location.href = `/dashboard/${branch.slug}/menu`;
            } else {
                showToast(data.error || "Failed to process payment", "error");
            }
        } catch (error) {
            showToast("Something went wrong", "error");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-black text-[#101828] mb-4 tracking-tight">
                    Choose a plan for <span className="text-[#F67D26]">{branch?.name || 'your restaurant'}</span>
                </h1>
                <p className="text-lg text-[#475467]">
                    Simple, transparent pricing that grows with your business. Upgrade anytime to unlock more features.
                </p>

                {/* Monthly / Annual Toggle */}
                <div className="flex items-center justify-center gap-4 mt-10">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="w-14 h-7 bg-[#68A544] rounded-full p-1 transition-colors duration-300 relative focus:outline-none"
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Annually <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 20%</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {pricingData.map((plan) => {
                    // Dynamic math for the 20% annual discount
                    const monthlyPrice = plan.price;
                    const annualPrice = monthlyPrice * 12 * 0.8; 

                    return (
                        <div 
                            key={plan.id} 
                            className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-xl ${
                                plan.isPopular 
                                ? 'border-2 border-[#F67D26] shadow-lg transform md:-translate-y-4' 
                                : 'border border-gray-200 shadow-sm'
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.isPopular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-[#F67D26] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1">
                                        <Star size={14} fill="currentColor" /> Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.label}</h3>
                                <p className="text-sm text-gray-500 min-h-[40px]">{plan.desc}</p>
                            </div>

                            {/* Price Display */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gray-900">
                                        {plan.currency}{(isAnnual ? annualPrice : monthlyPrice).toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 font-medium">/{isAnnual ? 'yr' : 'mo'}</span>
                                </div>
                                {isAnnual && monthlyPrice > 0 && (
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        Billed {plan.currency}{annualPrice.toLocaleString()} yearly
                                    </p>
                                )}
                            </div>

                            {/* Subscribe Button */}
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loadingPlan === plan.id}
                                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mb-8 transition-colors ${
                                    plan.isPopular 
                                    ? 'bg-[#F67D26] hover:bg-[#e0691c] text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                }`}
                            >
                                {loadingPlan === plan.id ? 'Loading...' : plan.btnText}
                                {!loadingPlan && plan.isPopular && <Rocket size={18} />}
                            </button>

                            {/* Features List */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">What's included</p>
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-[#68A544] shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600 leading-snug">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}