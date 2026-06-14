import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import { ChartNoAxesColumn, ShieldCheck, Smile, TrendingUp, Users, Zap } from 'lucide-react'

const benefits = [
  {id:1, icon: Zap, label: 'Faster Service', desc: 'Orders go straight to the kitchen instantly. Serve your guests in record time.' },
  {id:2, icon: Smile, label: 'Happier Guests', desc: 'No more waiting for a waiter. Customers order on their schedule, not yours.' },
  {id:3, icon: Users, label: 'Efficient Staff', desc: 'Your team focuses on hospitality, not running orders. Less stress, better service.' },
  {id:4, icon: ShieldCheck, label: 'Fewer Mistakes', desc: 'Digital orders eliminate miscommunication. Every order is exactly right, every time.' },
  {id:5, icon: TrendingUp, label: 'More Revenue', desc: 'Faster turnaround means more covers per shift. Upsell suggestions boost avg. ticket.' },
  {id:6, icon: ChartNoAxesColumn, label: 'Full Visibility', desc: "See what's selling, when, and at which table. Data-driven decisions at your fingertips." },
]

export const Benefits = () => {
  return (
    <section className='px-4 py-12 md:p-16'>
      <SmallHeader text='BENEFITS' color='#FF6F61' />
      <Header text='Results Your Business Will Feel' />
      <DescHeader text="QTend doesn't just digitize your menu — it transforms how your entire operation runs." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-16 max-w-desktop mx-auto">
        {benefits.map(b => {
          const IconComponent = b.icon

          return(
            <div key={b.id} className='bg-[#F7F7F7] py-8 px-6 md:py-12 md:px-8 rounded-2xl'>
              <div className="w-10 h-10 bg-[#FFFFFF] flex justify-center items-center border border-[#E8E8E8] rounded-full mb-4">
                <IconComponent color='#F67D26' className="w-5 h-5" />
                </div>
              <p className='font-bold text-lg text-[#1D1D1F] mb-2'>{b.label}</p>
              <p className='text-[#6B6B6B] text-sm leading-relaxed'>{b.desc}</p>
            </div>
          )
        })}
      </div>

    </section>
  )
}