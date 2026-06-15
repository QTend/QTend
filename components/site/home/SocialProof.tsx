import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import { Star } from 'lucide-react'

const companies = [
    'The Grand Palms', 
    'Trattoria Centrale', 
    'Urban Grains', 
    'Skybar Lounge', 
    'Salt & Stone', 
    'Paloma Café'
]

const testimonials = [
    {
        id: 1,
        quote: "We reduced our wait times by 40% in the first week. Our staff can now focus on actual hospitality instead of running orders.",
        name: "Marco Bernini",
        role: "Owner, Trattoria Centrale",
        initials: "MB"
    },
    {
        id: 2,
        quote: "Setup took 20 minutes. Our guests absolutely love it — especially the tourists who don't want to flag down a waiter.",
        name: "Aisha Kamara",
        role: "F&B Manager, The Grand Palms Hotel",
        initials: "AK"
    },
    {
        id: 3,
        quote: "Table turnover increased by almost 25% since we started using QTend. The analytics alone are worth the investment.",
        name: "Daniel Park",
        role: "Operations Director, Urban Grains Group",
        initials: "DP"
    }
]

export const SocialProof = () => {
  return (
    <section className='px-4 py-12 md:p-16 bg-[#FAFAF9]'>
        <SmallHeader text='SOCIAL PROOF' color='#0E8A54' />
        <Header text='Trusted by Hospitality Businesses Worldwide' />
        <DescHeader text="From independent restaurants to hotel groups — here's what real users say." />

        <div className="mt-10 md:mt-16 max-w-desktop mx-auto">
            
            {/* Company Pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                {companies.map((company, index) => (
                    <div 
                        key={index} 
                        className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium text-[#6B6B6B] shadow-sm"
                    >
                        {company}
                    </div>
                ))}
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map(t => (
                    <div 
                        key={t.id} 
                        className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full"
                    >
                        {/* 5 Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="#F67D26" color="#F67D26" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-[#4E4E4E] text-sm leading-relaxed mb-8 flex-grow">
                            "{t.quote}"
                        </p>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mt-auto">
                            {/* Avatar Placeholder (Swap with next/image if needed) */}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[#6B6B6B]">{t.initials}</span>
                            </div>
                            
                            <div className="grid gap-0.5">
                                <p className="font-bold text-sm text-[#1D1D1F]">{t.name}</p>
                                <p className="text-xs text-[#8A8A8A]">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </section>
  )
}