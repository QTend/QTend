import { Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <section className='relative min-h-[70svh] md:min-h-[73svh] w-full overflow-hidden flex items-center justify-center pt-20 pb-16 md:pt-24 md:pb-24'>

        <div className='px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center w-full relative z-10'>
            
            {/* Badge - Scaled down for mobile */}
            <div className='bg-white border border-gray-200 shadow-sm rounded-full p-1 w-fit flex items-center gap-1.5 mx-auto mb-6 md:mb-8 hover:shadow-md transition-shadow'>
                <div className="bg-[#0E8A54]/10 rounded-full p-1">
                    <Layers color='#0E8A54' size={14} className="sm:w-4 sm:h-4" />
                </div>
                <p className='text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700 pr-3'>
                    Everything included, every plan
                </p>
            </div>

            {/* Headline - Reduced from 4xl to 3xl on base mobile, relaxed the line-height slightly */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-center text-[#1D1D1F] leading-[1.2] md:leading-[1.1] max-w-4xl mx-auto">
                All the Tools to Run a{' '}
                <span className='text-[#F67D26] inline-block mt-1 sm:mt-0'>
                    Modern Hospitality Operation
                </span>
            </h1>

            {/* Subheadline - Dropped to text-sm on mobile, tighter top margin */}
            <p className='text-center text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-4 md:mt-6 leading-relaxed px-2 sm:px-0'>
                From instant QR ordering to real-time kitchen management and powerful analytics. QTend brings your entire operation into one seamless platform.            
            </p>

            {/* CTA Buttons - Slimmer padding (py-3 px-6) and text-sm for mobile */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mx-auto mt-8 md:mt-10'>
                <Link 
                    href={'/auth/sign-up'} 
                    className="w-full sm:w-auto bg-[#F67D26] hover:bg-[#ea580c] text-white font-bold text-sm md:text-base rounded-full py-3 px-6 md:py-4 md:px-8 text-center transition-all shadow-lg shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2"
                >
                    Start Free Trial <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                </Link>
                <button 
                    className="w-full sm:w-auto font-bold bg-white text-slate-800 border border-gray-200 shadow-sm text-sm md:text-base rounded-full py-3 px-6 md:py-4 md:px-8 text-center hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                >
                    Book a Demo
                </button>
            </div>

        </div>
    </section>
  )
}

export default Hero