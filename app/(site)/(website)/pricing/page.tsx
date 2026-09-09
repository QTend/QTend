"use client"

import React, { useState } from 'react'
import { Check, X, Zap, Headphones, ShieldCheck, Tag } from 'lucide-react'
import { SocialProof } from '@/components/site/home/SocialProof'
import { Faq } from '@/components/site/home/Faq'
import { Experience } from '@/components/site/home/Experience'
import { pricingData } from '@/constant/pricingData'
import { PricingHeader } from '@/components/site/pricing/PricingHeader'
import { PricingTrustBadges } from '@/components/site/pricing/PricingTrustBadges'
import { PricingComparison } from '@/components/site/pricing/PricingComparison'



export const PricingCards = ({ isAnnual }: { isAnnual: boolean }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-desktop mx-auto mb-20">
            {pricingData.map((plan) => {
                const isDark = plan.isPopular;
                // Simple calculation for annual display (20% off)
                const displayPrice = isAnnual && plan.price > 0 ? (plan.price * 12 * 0.8) : plan.price;

                return (
                    <div 
                        key={plan.id} 
                        className={`relative rounded-3xl p-8 border-2 transition-transform duration-300 hover:-translate-y-2 flex flex-col ${
                            isDark 
                                ? 'bg-[#111827] border-[#F97316] shadow-2xl shadow-orange-500/10' 
                                : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'
                        }`}
                    >
                        {isDark && (
                            <div className="absolute -top-4 right-8 bg-[#F97316] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                        )}

                        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {plan.label}
                        </h3>
                        
                        <div className="mb-4">
                            <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {plan.currency}{displayPrice.toLocaleString()}
                            </span>
                            {plan.price > 0 && <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> /month</span>}
                        </div>

                        <p className={`text-sm mb-8 min-h-[60px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {plan.desc}
                        </p>

                        <button className={`w-full py-3.5 rounded-xl font-bold text-sm mb-8 transition-colors ${
                            isDark 
                                ? 'bg-[#F97316] hover:bg-[#ea580c] text-white' 
                                : 'bg-gray-50 hover:bg-gray-100 text-slate-900 border border-gray-200'
                        }`}>
                            {plan.btnText}
                        </button>

                        <div className="flex-1">
                            <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-slate-900'}`}>
                                What's included
                            </p>
                            <ul className="space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${isDark ? 'bg-[#0E8A54]/20' : 'bg-green-100'}`}>
                                            <Check size={14} className="text-[#0E8A54]" strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section className="bg-white pt-24">
            <div className="px-5 sm:px-6 lg:px-8">
                <PricingHeader isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
                <PricingTrustBadges />
                <PricingCards isAnnual={isAnnual} />
            </div>
            

            
            <PricingComparison />
             <SocialProof />
             <Faq />
             <Experience />
        </section>
    )
}

export default PricingSection