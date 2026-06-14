import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import { Clock, DollarSign, Star, Table } from 'lucide-react'
import Image from 'next/image'

const analytics = [
    {id: 1, icon: DollarSign, label:"Today's Revenue", value: '$8,420'},
    {id: 2, icon: Clock, label:"Today's Revenue", value: '$8,420'},
    {id: 3, icon: Star, label:"Today's Revenue", value: '$8,420'},
    {id: 4, icon: Table, label:"Today's Revenue", value: '$8,420'},
]

export const Analytics = () => {
  return (
    <section className='px-4 py-12 md:p-16 bg-[#111110]'>
        <div className='flex flex-col lg:flex-row justify-between items-center gap-10 md:gap-12 max-w-desktop mx-auto'>
             <div className='grid gap-3 w-full lg:w-[45%]'>
                <SmallHeader text='ANALYTICS' color='#F67D26' left={true} />
                <Header text='Run Your Business on Data, Not Guesswork' color='#F7F7F7' left={true} />
                {/* Fixed the typo with the quotation marks here! */}
                <DescHeader text="Know exactly what's selling, when you're busiest, and how your tables are performing — in real time." color="#F0F0F0" left={true} />

                <div className='grid grid-cols-2 gap-3 md:gap-5 mt-4 md:mt-6'>
                    {analytics.map(a => {
                        const IconComponent = a.icon

                        return(
                            <div key={a.id} className='rounded-2xl bg-[#333330] py-4 px-4 md:py-5 md:px-5'>
                                <div className='flex gap-1.5 items-center mb-2'>
                                    <IconComponent size={16} color='#F67D26' />
                                    <p className='text-xs text-[#F0F0F0] font-medium'>{a.label}</p>
                                </div>
                                <p className='font-bold text-[#F7F7F7] text-xl md:text-2xl'>{a.value}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='flex w-full lg:w-[50%] mt-6 lg:mt-0'>
                <Image 
                    src={'/analytics.png'} 
                    alt={'Analytics image'}
                    width={803} 
                    height={259} 
                    className='w-full h-auto object-contain drop-shadow-xl'
                />
            </div>
        </div>
        
    </section>
  )
}