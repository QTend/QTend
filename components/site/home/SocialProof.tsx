import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'

export const SocialProof = () => {
  return (
    <section className='px-4 py-12 md:p-16 bg-[#FAFAF9]'>
        <SmallHeader text='SOCIAL PROOF' color='#0E8A54' />
        <Header text='Trusted by Hospitality Businesses Worldwide' />
        <DescHeader text="From independent restaurants to hotel groups — here's what real users say." />

        {/* Added standard responsive margin and max-width for when you add the reviews */}
        <div className="mt-10 md:mt-16 max-w-desktop mx-auto">

        </div>
    
    </section>
  )
}