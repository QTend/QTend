import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export const PlatformHeroSplit = () => {
    return (
        <section className="bg-white pt-24 pb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Content */}
                <div className="w-full lg:w-1/2 flex flex-col items-start">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F7F7]  mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#0E8A54]"></div>
                        <span className="text-xs font-medium text-[#6B6B6B]">The complete hospitality ordering platform</span>
                    </div>

                    <h1 className="text-[40px] md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        One Platform.<br />
                        <span className="text-[#F97316]">Every Table.</span><br />
                        Total Control.
                    </h1>

                    <p className="text-lg text-[#6B6B6B] mb-10 leading-relaxed max-w-lg">
                        QTend connects your guests, kitchen, and management in a seamless digital flow — from the moment they scan to the moment they pay.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
                        <button className="bg-[#F97316] hover:bg-[#ea580c] text-white px-8 py-3.5 rounded-xl font-bold transition-all w-full sm:w-auto">
                            Start Free
                        </button>
                        <button className="bg-white text-slate-700 border border-gray-200 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-bold transition-all w-full sm:w-auto">
                            Book a Demo
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {['No app required', 'Setup in 20 min', 'Free 14-day trial'].map((check, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[#0E8A54]" />
                                <span className="text-sm font-medium text-slate-600">{check}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Visuals (CSS Mockups) */}
                <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center lg:justify-end">
                    
                    <div className='flex justify-center items-center flex-1 w-full'>
                        <Image 
                            src={'/resources.png'} 
                            alt={'image'}
                            width={390} 
                            height={632.39} 
                            className='w-150 h-auto object-contain'
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}