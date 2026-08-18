import { Bell, Edit, Monitor, RefreshCw, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Kitchen = () => {
  return (
    <section className="max-w-desktop mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col">
        <div className="relative flex items-center mb-8">
            <div className="relative bg-white pr-4 flex items-center gap-3">
                <div className="bg-[#F95B5B] p-2 rounded-lg">
                    <Monitor className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#1D1D1F] text-base tracking-wide">Kitchen & Operations</span>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Visual Side */}
            <div className='flex justify-center items-center flex-1 w-full'>
                <Image 
                    src={'/kitchen.png'} 
                    alt={'image'}
                    width={390} 
                    height={632.39} 
                    className='w-150 h-auto object-contain'
                />
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-1/2">
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] leading-[1.15] mb-5 tracking-tight">
                    Your kitchen, running like clockwork
                </h2>
                <p className="text-[#6B6B6B] text-base mb-8 leading-relaxed">
                    Orders flow from guest's phone straight to your kitchen display. Staff see every order the moment it's placed — no shouting, no paper tickets, no missed items.
                </p>

                <div className="flex flex-col gap-4">
                    {[
                        { icon: Monitor, title: 'Kitchen Display System', desc: 'Color-coded order cards with live status updates for every station.' },
                        { icon: Bell, title: 'Instant Notifications', desc: 'Staff get alerted the moment a new order is placed or updated.' },
                        { icon: Shield, title: 'Staff Permissions', desc: 'Assign roles — manager, server, kitchen — with separate access levels.' },
                        { icon: RefreshCw , title: 'Order Modification', desc: 'Update or cancel orders mid-stream without confusion.' },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-start gap-4">
                            <div className="bg-[#F7F7F7] border-[#E8E8E8] border p-2 rounded-lg shrink-0">
                                <feature.icon className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1D1D1F] text-sm mb-0.5">{feature.title}</h4>
                                <p className="text-[#6B6B6B] text-xs leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
   
  )
}

export default Kitchen