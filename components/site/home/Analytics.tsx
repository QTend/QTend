



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
    <section className='p-16 bg-[#111110]'>
        <div className='flex justify-between items-center gap-12'>
             <div className='grid gap-2'>
                <SmallHeader text='ANALYTICS' color='#F67D26' left={true} />
                <Header text='Run Your Business on Data,Not Guesswork' color='#F7F7F7' left={true} />
                <DescHeader text="Know exactly what's selling, when you're busiest, and how your tables are performing — in real time.' color='#F0F0F0" left={true} />

                <div className='grid grid-cols-2 gap-5'>
                    {analytics.map(a => {
                        const IconComponent = a.icon

                        return(
                            <div key={a.id} className='rounded-2xl bg-[#333330] py-5 px-3'>
                                <div className='flex gap-1 items-center mb-1'>
                                    <IconComponent size={16} color='#F67D26' />
                                    <p className='text-xs text-[#F0F0F0]'>{a.label}</p>
                                </div>
                                <p className='font-bold text-[#F7F7F7] text-xl'>{a.value}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='flex flex-[60%]'>
                <Image 
                    src={'/analytics.png'} 
                    alt={'Analytics image'}
                    width={803} 
                    height={259} 
                    className='object-cover'
                />
            </div>
        </div>
        
    </section>
  )
}
