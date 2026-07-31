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



export function Header({branch, zone}: {branch :BranchProps, zone?: boolean}){
    const {isOpen, setIsOpen} = useNotify()
    return(
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">{branch?.name}</p>
                    <p className="text-[#666666] text-sm">{branch?.location?.address}</p>
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