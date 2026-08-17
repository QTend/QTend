import { CheckCircle2, LayoutDashboard, Table2 } from 'lucide-react'

const Management = () => {
  return (
    <section className="max-w-desktop mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-5">
        <div className="relative flex items-center">
            <div className="relative bg-white pr-4 flex items-center gap-3">
                <div className="bg-[#0E8A54] p-2 rounded-lg">
                    <Table2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#1D1D1F] text-base tracking-wide">Menu Management</span>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            {/* Visual Side */}
            <div className="w-full lg:w-1/2">
                {/* Abstract Dashboard Mockup */}
                <div className="bg-[#FAFAFA] rounded-2xl border border-gray-200 shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                        <span className="font-bold text-gray-800">Menu Editor</span>
                        <div className="bg-[#F67D26] text-white text-xs font-bold px-3 py-1.5 rounded-full">+ Add Item</div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Starters', count: 4, active: true },
                            { name: 'Main Courses', count: 8, active: true },
                            { name: 'Desserts', count: 5, active: true },
                            { name: 'Seasonal Menu', count: 3, active: false },
                        ].map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border border-gray-300 rounded flex flex-col justify-center items-center gap-[2px]"><span className="w-2 h-px bg-gray-400"></span><span className="w-2 h-px bg-gray-400"></span><span className="w-2 h-px bg-gray-400"></span></div>
                                    <span className="font-bold text-sm text-gray-800">{row.name} <span className="text-gray-400 font-normal ml-2">{row.count} items</span></span>
                                </div>
                                {/* Mock Toggle */}
                                <div className={`w-10 h-6 rounded-full flex items-center px-1 ${row.active ? 'bg-[#0E8A54] justify-end' : 'bg-gray-200 justify-start'}`}>
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-6 font-medium">Changes go live instantly — no refresh needed</p>
                </div>
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-1/2">

                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] leading-[1.15] mb-5 tracking-tight">                   
                    Update your menu in seconds, not days
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Ditch the laminator. Add dishes, change prices, upload photos, and pause out-of-stock items — all from your phone or browser, any time.
                </p>

                <div className="flex flex-col gap-4">
                    {[
                        'Add items with photos, descriptions, and allergens',
                        'Organize into categories and sub-menus',
                        'Pause availability instantly when stock runs low',
                        'Schedule items to appear at certain hours',
                        'Duplicate menus for multiple locations'
                    ].map((text, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-[#0E8A54] shrink-0" />
                            <span className="text-[#1D1D1F] text-sm md:text-base pt-0.5">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
   
  )
}

export default Management