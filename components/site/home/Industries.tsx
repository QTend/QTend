


import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import { Box, Building2, Coffee, Sofa, SunMedium, Utensils, Wine } from 'lucide-react'


const industries = [
    {id: 1, icon: Utensils, color: '#F67D26',  label: 'Restaurants', desc: 'Full-service & casual dining'},
    {id: 2, icon: Building2, color: '#0E8A54',  label: 'Hotels', desc: 'Room service & hotel dining'},
    {id: 3, icon: Wine, color: '#FF6F61',  label: 'Bars', desc: 'Cocktail bars & nightlife'},
    {id: 4, icon: Sofa, color: '#1D1D1F',  label: 'Lounges', desc: 'Premium lounge experiences'},
    {id: 5, icon: Coffee, color: '#F67D26',  label: 'Cafés', desc: 'Coffee shops & bakeries'},
    {id: 6, icon: SunMedium, color: '#0E8A54',  label: 'Beach Clubs', desc: 'Poolside & beach service'},
    {id: 7, icon: Box, color: '#FF6F61',  label: 'Fast Food', desc: 'QSR & food chains'},
]


const IndustriesComponents = ({
    IconComponent,
    label, 
    desc,
    color,
}: any) => (
    <div className='flex gap-2 items-start bg-white py-5 px-4 rounded-3xl'>
        <div 
        style={{backgroundColor: color}}
        className="w-10 h-10 flex justify-center items-center border-[#E8E8E8] rounded-lg">
            <IconComponent color={'#fff'} className=" w-5 h-5 " />
        </div>
        <div>
            <p className='font-bold text-sm text-[#1D1D1F]'>{label}</p>
            <p className='text-xs text-[#6B6B6B]'>{desc}</p>
        </div>
    </div>
)


export const Industries = () => {
  return (
    <section className='p-16 bg-[#F7F7F7]'>
        <SmallHeader text='INDUSTRIES' color='#0E8A54' />
        <Header text='Qtend Works Everywhere Food is Served' />
        <DescHeader text='From intimate cafés to sprawling hotel groups — one platform that
adapts to every hospitality format.' /> 

        <div className='max-w-desktop mx-auto mt-16'>
            <div className='grid grid-cols-4 gap-5 mb-5'>
                {industries.slice(0, 4).map(i => {
                    const IconComponent = i.icon
                    return(
                        <div key={i.id}>
                            <IndustriesComponents  color={i.color} IconComponent={IconComponent} label={i.label} desc={i.desc}  />
                        </div>
                       
                    )
                })}
            </div>
            <div className='flex justify-center items-center  gap-20'>
                {industries.slice(4).map(i => {
                    const IconComponent = i.icon
                    return(
                        <IndustriesComponents key={i.id} color={i.color} IconComponent={IconComponent} label={i.label} desc={i.desc}  />
                    )
                })}
            </div>
        </div>

    </section>
  )
}
