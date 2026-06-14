import { Dot } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className='relative min-h-[100svh] md:min-h-[748px] md:h-[748px] w-full overflow-hidden flex flex-col justify-between pt-24 md:pt-16'>
        {/* Background Layer */}
        <div className='absolute inset-0 -z-20'>
            <Image 
            src='/heroBanner.jpg'
            alt='hero image'
            priority
            fill
            sizes='100vw'
            className='object-cover object-center'
            />
        </div>
        <div className='bg-[#1f1004d3] absolute inset-0 -z-10'/>

        {/* Text Block */}
        <div className='px-4 max-w-6xl mx-auto flex flex-col items-center w-full relative z-10'>
            <div className='bg-[#F7F7F7] rounded-full px-2 w-fit flex items-center mx-auto'>
                <Dot color='#0E8A54' size={28}  />
                <p className='text-xs font-medium text-[#6B6B6B] pr-2'>Trusted by 1,200+ hospitality businesses</p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mt-6 text-center leading-tight">
                Let Customers Order <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-[#F67D26] to-[#1AB653] bg-clip-text text-transparent">
                     From Their Table
                </span>{' '}
                <br className="sm:hidden" />
                in Seconds
            </h1>

            <p className='text-center text-sm md:text-base text-[#F0F0F0] max-w-2xl mx-auto mt-4 sm:mt-6'>
                QR-powered ordering for restaurants, bars, lounges, cafés, and hotels. Reduce wait times, improve service speed, and streamline operations.
            </p>

            <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-fit mx-auto mt-8'>
                <div className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-3 sm:py-2.5 px-4 w-full sm:w-auto text-center cursor-pointer hover:bg-[#e06d1e] transition-colors">
                  Get started
                </div>
                <div className="font-medium bg-white text-slate-900 text-sm rounded-lg py-3 sm:py-2.5 px-4 w-full sm:w-auto text-center cursor-pointer hover:bg-gray-100 transition-colors">
                  Book a Demo
                </div>
            </div>
        </div>

        {/* Product Image */}
        <div className='w-full max-w-[800px] mx-auto px-4 sm:px-6 md:px-4 mt-12 md:mt-auto translate-y-12 md:translate-y-24 relative z-10'>
            <Image 
            src='/productHero.png'
            alt='Product preview'
            width={1024}
            height={724}
            className='w-full h-auto rounded-t-xl sm:rounded-t-2xl shadow-2xl border-t border-x border-white/20'
            priority
            />
        </div>
    </section>
  )
}

export default Hero