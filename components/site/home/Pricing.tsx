"use client"

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

// Dummy components so the code runs - replace with your actual imports
const SmallHeader = ({ text, color }: { text: string, color: string }) => <p style={{ color }} className="text-sm font-bold tracking-widest text-center mb-3">{text}</p>
const Header = ({ text }: { text: string }) => <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#1D1D1F] mb-4">{text}</h2>
const DescHeader = ({ text }: { text: string }) => <p className="text-[#6B6B6B] text-center max-w-2xl mx-auto text-lg">{text}</p>

const pricingData = [
    {
        id: 1, 
        label: 'Digital Menu (Free)', 
        price: 0, 
        currency: '₦',
        isCustom: false,
        desc: 'Replace expensive paper menus. Perfect for getting your restaurant digitized at zero cost.',
        features: [
            'Unlimited tables & items',
            'Digital QR code generation',
            'Update prices instantly',
            'View-only (Customers order via waiter)'
        ],
        btnText: 'Start for Free',
        isPopular: false
    },
    {
        id: 2, 
        label: 'Starter', 
        price: 25000, 
        currency: '₦',
        isCustom: false,
        desc: 'Perfect for small cafés, bars, and food trucks doing counter service.',
        features: [
            'Everything in Free, plus:',
            'Customers order from their phone',
            'Live order management dashboard',
            'Real-time incoming alerts',
            'Email & WhatsApp support'
        ],
        btnText: 'Start 14-Day Trial',
        isPopular: false
    },
    {
        id: 3, 
        label: 'Pro', 
        price: 45000, 
        currency: '₦',
        isCustom: false,
        desc: 'For busy dine-in restaurants, clubs, and lounges that need deep kitchen routing.',
        features: [
            'Everything in Starter, plus:',
            'Call Waiter feature (Live requests)',
            'Kitchen Display System (KDS)',
            'Up to 5 prep zones (Grill, Bar, etc.)',
            'Advanced analytics & reports',
            'Priority customer support'
        ],
        btnText: 'Get Pro',
        isPopular: true
    }
]

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <section className='px-4 py-16 md:py-24 bg-white'>
        <SmallHeader text='PRICING' color='#F97316' />
        <Header text='Simple, Transparent Pricing'  />
        <DescHeader text='Start free. No setup fees. No hidden costs. Cancel any time.' />

        {/* Billing Toggle */}
        <div className="flex justify-center items-center mt-8 md:mt-10">
            <div className="bg-[#F7F7F7] p-1.5 rounded-full flex items-center border border-gray-100">
                <button 
                    onClick={() => setIsYearly(false)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isYearly ? 'bg-white shadow-sm text-[#1D1D1F]' : 'text-[#6B6B6B] hover:text-[#1D1D1F]'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setIsYearly(true)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isYearly ? 'bg-white shadow-sm text-[#1D1D1F]' : 'text-[#6B6B6B] hover:text-[#1D1D1F]'}`}
                >
                    Yearly <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
                </button>
            </div>
        </div>

        {/* Pricing Cards Grid - Updated for 3 columns */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto mt-12'>
            {pricingData.map((plan) => {
                const isDark = plan.isPopular;
                const checkColor = isDark ? '#F97316' : '#16A34A';
                // Apply a 20% discount if yearly is selected
                const calculatedPrice = isYearly && plan.price > 0 ? (plan.price * 12) * 0.8 : plan.price;
                const billingText = plan.price === 0 ? 'forever' : isYearly ? '/year' : '/month';

                return (
                    <div 
                        key={plan.id} 
                        className={`relative rounded-3xl p-6 md:p-8 flex flex-col h-full transition-all duration-300 ${isDark ? 'bg-[#1D1D1F] text-white shadow-2xl md:-translate-y-4 z-10 border border-gray-800' : 'bg-white text-[#1D1D1F] border border-gray-200 hover:border-orange-200 hover:shadow-lg'}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                                Most Popular
                            </div>
                        )}

                        <p className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                            {plan.label}
                        </p>
                        
                        <div className="flex items-baseline gap-1 mb-4">
                            <h3 className={`text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                                {plan.currency}{formatPrice(calculatedPrice)}
                            </h3>
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {billingText}
                            </span>
                        </div>

                        <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plan.desc}
                        </p>

                        <div className="flex flex-col gap-4 mb-10 mt-auto">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 
                                        className="w-5 h-5 shrink-0 mt-0.5" 
                                        color={checkColor}
                                        fill={isDark ? "rgba(249, 115, 22, 0.2)" : "rgba(22, 163, 74, 0.1)"}
                                    />
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
                                isDark 
                                ? 'bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg shadow-orange-500/25' 
                                : plan.price === 0 
                                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                                    : 'bg-white text-[#1D1D1F] border border-gray-200 hover:border-gray-300 shadow-sm'
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