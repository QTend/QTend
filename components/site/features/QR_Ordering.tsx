import { 
    QrCode, Zap, Smartphone, RefreshCw, Lock,
    Globe,
    Repeat
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const QR_Ordering = () => {
  return (
    <div className="bg-white py-6 md:py-8 w-full max-w-desktop mx-auto">
        <div className="relative bg-white pr-4 flex items-center gap-3 px-4 mb-4">
            <div className="bg-[#F67D26] p-2 rounded-lg">
                <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#1D1D1F] text-base tracking-wide">QR Ordering</span>
        </div>

        <div className='flex flex-col lg:flex-row items-center px-4'>
             {/* Visual Side */}
            <div className='flex justify-center items-center flex-1 w-full'>
                <Image 
                    src={'/qr_ordeing.png'} 
                    alt={'image'}
                    width={390} 
                    height={632.39} 
                    className='w-150 h-auto object-contain'
                />
             </div>

            {/* Text Side */}
            <div className="w-full lg:w-1/2">

                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] leading-[1.15] mb-5 tracking-tight">
                    Zero-friction ordering from any table
                </h2>
                <p className="text-gray-600 text-base mb-10 leading-relaxed">
                    Guests scan once and get an instant, beautiful menu — no app download, no account creation. Works on every smartphone with a camera.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: Zap, title: 'Under 2s load time', desc: 'Menu opens instantly, every time' },
                        { icon: Globe, title: 'No app required', desc: 'Pure browser-based experience' },
                        { icon: Lock, title: 'Table-specific QR', desc: 'Each table gets a unique, tracked code' },
                        { icon: Repeat, title: 'Reorder easily', desc: 'Guests can add to their order anytime' },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-[#FAFAFA] flex gap-5 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <div className='bg-[#FFFFFF] border-[#E8E8E8] rounded-lg p-2'>
                            <feature.icon className="w-5 h-5 text-[#F67D26] mb-3" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1D1D1F] text-sm mb-1">{feature.title}</h4>
                                <p className="text-[#6B6B6B] text-xs leading-relaxed">{feature.desc}</p>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
       
    </div>
  )
}

export default QR_Ordering