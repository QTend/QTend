import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'

const faqs = [
    {id: 1, question: 'Do customers need to download an app?', answer: "No. Customers just scan the QR code with their phone's camera and the menu opens instantly in their browser. No app, no account, no friction."},
    {id: 2, question: 'How long does setup take?', answer: "Most restaurants are up and running in under 30 minutes. You can upload your menu, generate QR codes, and start taking orders the same day."},
    {id: 3, question: 'Can I edit my menu at any time?', answer: "Yes. Update prices, add items, pause out-of-stock dishes, and change photos in real time from your dashboard — no reprinting required."},
    {id: 4, question: 'Does QTend work for bars and nightlife venues?', answer: "Absolutely. QTend is used by bars, cocktail lounges, beach clubs, and rooftop venues. Any table-service environment works great."},
    {id: 5, question: 'Does it require special hardware?', answer: "No special hardware needed. QTend works on any device with a browser — tablet, phone, or laptop. We provide printable QR code sheets."},
    {id: 6, question: 'Can I manage multiple locations?', answer: "Yes. The Enterprise plan supports multi-location management from a single dashboard, with location-level analytics and menu control."},
]

export const Faq = () => {
  return (
    <section className='px-4 py-12 md:p-16 bg-[#F7F7F7]'>
        <SmallHeader text='FAQ' color='#0E8A54' />
        <Header text='Questions? We Have Answers.' />

        <div className='max-w-[800px] w-full mx-auto mt-10 md:mt-16'>
            {faqs.map(f => (
                <div key={f.id} className='bg-white rounded-2xl p-5 md:p-6 mb-3 shadow-sm border border-gray-100'>
                    <p className='font-bold text-base md:text-lg text-[#1D1D1F] mb-2'>{f.question}</p>
                    <p className='text-[#6B6B6B] text-sm md:text-base leading-relaxed'>{f.answer}</p>
                </div>
            ))}
        </div>

    </section>
  )
}