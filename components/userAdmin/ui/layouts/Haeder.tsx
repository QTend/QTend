'use client'

import { PiBellSimpleLight } from "react-icons/pi";
import { QrCode, Settings } from "lucide-react";
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
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div className="flex items-center gap-2">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#68A544] shrink-0">
                        {/* Explicitly verify that logo.url exists and is not an empty string */}
                        {typeof branch?.branding?.logo?.url === 'string' && branch.branding.logo.url.trim() !== '' ? (
                        <Image 
                            src={branch.branding.logo.url} 
                            alt={`${branch?.name || 'Branch'} Logo`}
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                        ) : (
                        // Fallback: Extracts initials (e.g., "Chime Kitchen" -> "CK")
                        <div className="w-full h-full flex items-center justify-center bg-[#68A544]">
                            <span className="text-xl font-semibold text-white uppercase">
                            {branch?.name
                                ? branch.name
                                    .split(' ')
                                    .filter(Boolean) // Fix: Removes empty elements caused by double spaces
                                    .map((word) => word[0]) // Fix: Safely extracts the first letter of each word
                                    .join('')
                                    .slice(0, 2)
                                : 'NA'}
                            </span>
                        </div>
                        )}
                    </div>

                    <div>
                        <p className="text-2xl font-medium text-[#333333]">{branch?.name}</p>
                        <p className="text-[#666666] text-sm">{branch?.location?.address}</p>
                    </div>
                </div>

                {
                    !zone && (
                        <div className="flex items-center gap-4 ">
                    <Link href={`/dashboard/${branch.slug}/settings/tables`}>
                        <GradientButton label="Download menu QR" icon={<QrCode />}  />
                    </Link>
                    <NotificationComp branchId={branch._id} isOpen={isOpen} setIsOpen={setIsOpen} />
                    <button
                    onClick={() => signOut()} 
                    className="bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
                    >
                        logout
                    </button>
                      
                </div>
                    )
                }
                
            </div>
            
        </div>
    )
}