'use client'

import { PiBellSimpleLight } from "react-icons/pi";
import { LogOut, QrCode, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { BranchProps } from "@/types/BranchType";
import Link from "next/link";
import { GradientButton } from "../Buttons";
import { useState } from "react";
import NotificationComp from "../NotificationComp";
import { useNotify } from "@/context/NotificationContext";
import Image from "next/image";

export function Header({branch, zone}: {branch :BranchProps, zone?: boolean}){
    const {isOpen, setIsOpen} = useNotify()
    return(
        <div className="bg-white py-3 md:py-5 border-b md:border-none border-gray-100">
            <div className="max-w-7xl flex justify-between items-center mx-auto px-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden bg-[#68A544] shrink-0">
                        {typeof branch?.branding?.logo?.url === 'string' && branch.branding.logo.url.trim() !== '' ? (
                        <Image 
                            src={branch.branding.logo.url} 
                            alt={`${branch?.name || 'Branch'} Logo`}
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#68A544]">
                            <span className="text-sm md:text-xl font-semibold text-white uppercase">
                            {branch?.name
                                ? branch.name.split(' ').filter(Boolean).map((word) => word[0]).join('').slice(0, 2)
                                : 'NA'}
                            </span>
                        </div>
                        )}
                    </div>

                    <div>
                        <p className="text-lg md:text-2xl font-medium text-[#333333] leading-tight">{branch?.name}</p>
                        <p className="text-[#666666] text-xs md:text-sm line-clamp-1">{branch?.location?.address}</p>
                    </div>
                </div>

                {!zone && (
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href={`/dashboard/${branch.slug}/settings/tables`} className="hidden sm:block">
                            <GradientButton label="Download QR" icon={<QrCode size={18} />} />
                        </Link>
                        {/* Mobile-only QR Button */}
                        <Link href={`/dashboard/${branch.slug}/settings/tables`} className="sm:hidden p-2 rounded-full bg-orange-50 text-[#F67D26]">
                            <QrCode size={20} />
                        </Link>
                        
                        <NotificationComp branchId={branch._id} isOpen={isOpen} setIsOpen={setIsOpen} />
                        
                        <button
                            onClick={() => signOut()} 
                            className="bg-red-50 md:bg-red-600 p-2 md:px-5 md:py-2 rounded-full md:rounded-lg text-red-600 md:text-white cursor-pointer transition-colors"
                        >
                            <span className="hidden md:block">Logout</span>
                            <LogOut size={20} className="md:hidden" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}