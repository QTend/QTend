"use client"

import { useState } from 'react'
import { DescHeader } from '../DescHeader'
import { Header } from '../Header'
import { SmallHeader } from '../SmallHeader'
import { CheckCircle2 } from 'lucide-react'

const pricingData = [
    {
        id: 1, 
        label: 'Starter', 
        price: 25000, 
        currency: '₦',
        isCustom: false,
        desc: 'Perfect for small cafés, bars, and single-location dining spots looking to digitize.',
        features: [
            'Up to 15 tables',
            'Digital QR menu',
            'Live order management dashboard',
            '1 Admin account',
            'Standard email & WhatsApp support'
        ],
        btnText: 'Book a Demo',
        isPopular: false
    },
    {
        id: 2, 
        label: 'Pro', 
        price: 40000, 
        currency: '₦',
        isCustom: false,
        desc: 'For busy restaurants and lounges needing premium real-time features and deep insights.',
        features: [
            'Unlimited tables',
            'Call Waiter feature (Real-time requests)',
            'Kitchen Display System (KDS)',
            'Up to 5 staff/waiter accounts',
            'Advanced analytics',
            // 'Advanced analytics & busy hour reports',
            'Priority customer support'
        ],
        btnText: 'Book a Demo',
        isPopular: true
    },
    // {
    //     id: 3, 
    //     label: 'Enterprise', 
    //     price: 0, 
    //     currency: '',
    //     isCustom: true,
    //     desc: 'For hotel groups, chains, and multi-location hospitality empires.',
    //     features: [
    //         'Multi-location management centralized',
    //         'Custom domains (e.g., menu.yourhotel.com)',
    //         'Custom POS & PMS integrations',
    //         'Unlimited staff accounts',
    //         'Dedicated VIP account manager',
    //         'SLA & uptime guarantees'
    //     ],
    //     btnText: 'Contact Sales',
    //     isPopular: false
    // },
]

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  // Helper to format numbers with commas
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <section className='px-4 py-16 md:py-24 bg-white'>
        <SmallHeader text='PRICING' color='#FF6F61' />
        <Header text='Simple, Transparent Pricing'  />
        <DescHeader text='Start free. No setup fees. No hidden costs. Cancel any time.' />

        {/* Billing Toggle */}
        <div className="flex justify-center items-center mt-8 md:mt-10">
            <div className="bg-[#F7F7F7] p-1.5 rounded-full flex items-center border border-gray-200">
                <button 
                    onClick={() => setIsYearly(false)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isYearly ? 'bg-white shadow-sm text-[#1D1D1F]' : 'text-[#6B6B6B] hover:text-[#1D1D1F]'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setIsYearly(true)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isYearly ? 'bg-white shadow-sm text-[#1D1D1F]' : 'text-[#6B6B6B] hover:text-[#1D1D1F]'}`}
                >
                    Yearly
                </button>
            </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-desktop mx-auto mt-12'>
            {pricingData.map((plan) => {
                const isDark = plan.isPopular;
                const checkColor = isDark ? '#F67D26' : '#0E8A54';
                const calculatedPrice = isYearly ? plan.price * 12 : plan.price;
                const billingText = isYearly ? '/year' : '/month';

                return (
                    <div 
                        key={plan.id} 
                        className={`relative rounded-3xl p-6 md:p-8 flex flex-col h-full ${isDark ? 'bg-[#1D1D1F] text-white shadow-xl scale-100 md:scale-105 z-10' : 'bg-[#F7F7F7] text-[#1D1D1F]'}`}
                    >
                        {/* Most Popular Badge */}
                        {plan.isPopular && (
                            <div className="absolute top-6 right-6 bg-[#F67D26] text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                                Most Popular
                            </div>
                        )}

                        <p className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                            {plan.label}
                        </p>
                        
                        <div className="flex items-baseline gap-1 mb-4">
                            {plan.isCustom ? (
                                <h3 className="text-4xl md:text-5xl font-bold">Custom</h3>
                            ) : (
                                <>
                                    <h3 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-[#F67D26]' : 'text-[#1D1D1F]'}`}>
                                        {plan.currency}{formatPrice(calculatedPrice)}
                                    </h3>
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B6B6B]'}`}>
                                        {billingText}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-[#6B6B6B]'}`}>
                            {plan.desc}
                        </p>

                        <div className="flex flex-col gap-4 mb-10">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 
                                        className="w-5 h-5 shrink-0" 
                                        color={checkColor}
                                        fill={checkColor}
                                        stroke="white" 
                                        strokeWidth={2}
                                    />
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-[#4E4E4E]'}`}>
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={`mt-auto w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-transform active:scale-95 ${
                                isDark 
                                ? 'bg-[#F67D26] text-white hover:bg-[#e06d1e]' 
                                : 'bg-white text-[#1D1D1F] shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]'
                            }`}
                        >
                            {plan.btnText}
                        </button>
                    </div>
                )
            })}
        </div>
    </section>
  )
}