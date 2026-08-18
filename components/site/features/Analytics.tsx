import { ChartNoAxesColumn, Clock, DollarSign, Download, FileText, Star, TableProperties, TrendingUp, Users } from 'lucide-react'
import Image from 'next/image'

const Analytics = () => {
  return (
    <section className="max-w-desktop mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col">
        <div className="relative flex items-center">
            <div className="relative bg-white pr-4 flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-lg">
                    <ChartNoAxesColumn className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#1D1D1F] text-base tracking-wide">Analytics & Reporting</span>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            {/* Visual Side */}
            <div className='flex justify-center items-center flex-1 w-full'>
                <Image 
                    src={'/features_analytics.png'} 
                    alt={'image'}
                    width={390} 
                    height={632.39} 
                    className='w-150 h-auto object-contain'
                />
            </div>


            {/* Text Side */}
            <div className="w-full lg:w-1/2">
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] leading-[1.15] mb-5 tracking-tight">
                    Understand your business at a glance
                </h2>
                <p className="text-[#6B6B6B] text-base mb-8 leading-relaxed">
                    Stop guessing what's working. QTend gives you real-time and historical data on every aspect of your operation — from best-selling items to peak hours by table.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: DollarSign, text: 'Daily & Weekly Revenue' },
                        { icon: Clock, text: 'Peak Ordering Hours' },
                        { icon: Star, text: 'Best-selling Items' },
                        { icon: TableProperties, text: 'Per-table Activity' },
                        { icon: TrendingUp, text: 'Revenue Growth Trends' },
                        { icon: FileText, text: 'Exportable Reports' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 py-2.5 px-4 rounded-xl hover:border-green-400 transition-colors">
                            <item.icon className="w-4 h-4 text-[#0E8A54]" />
                            <span className="font-medium text-[#1D1D1F] text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Analytics