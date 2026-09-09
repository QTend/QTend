import React from 'react';

export const DemoBanner = () => {
    return (
        <section className="bg-[#18181B] py-16 px-5 border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                
                {/* Left side: Headers */}
                <div className="max-w-2xl">
                    <p className="text-[#F67D26] font-bold text-sm tracking-widest uppercase mb-3">
                        Book a Demo
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        See QTend Live.<br />
                        No Pressure. No Commitment.
                    </h1>
                </div>

                {/* Right side: Stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 shrink-0">
                    <div>
                        <p className="text-2xl font-bold text-[#F67D26] mb-1">20 min</p>
                        <p className="text-[#F7F7F7] text-xs font-medium">Average setup</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-800"></div>
                    <div>
                        <p className="text-2xl font-bold text-[#F67D26] mb-1">40%</p>
                        <p className="text-[#F7F7F7] text-xs font-medium">Avg. wait time reduction</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-800"></div>
                    <div>
                        <p className="text-2xl font-bold text-[#F67D26] mb-1">1,200+</p>
                        <p className="text-[#F7F7F7] text-xs font-medium">Happy businesses</p>
                    </div>
                </div>

            </div>
        </section>
    );
};