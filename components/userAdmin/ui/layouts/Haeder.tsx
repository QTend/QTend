'use client'

import { PiBellSimpleLight } from "react-icons/pi";
import { QrCode, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { BranchProps } from "@/types/BranchType";
import Link from "next/link";
import { GradientButton } from "../Buttons";



export function Header({branch}: {branch :BranchProps}){
    return(
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">{branch?.name}</p>
                    <p className="text-[#666666] text-sm">{branch?.location?.address}</p>
                </div>
                <div className="flex items-center gap-4 ">
                    <Link href={`/dashboard/${branch.slug}/settings/tables`}>
                        <GradientButton label="Download menu QR" icon={<QrCode />} />
                    </Link>
                    <div className="bg-[#F2F2F2] w-12 h-12 rounded-full flex justify-center items-center relative">
                    <PiBellSimpleLight size={30} />
                    <div className="w-2 h-2 rounded-full bg-[#FF4848] absolute right-3 bottom-4" />
                    </div>
                </div>
            </div>
            
        </div>
    )
}