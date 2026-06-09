'use client'

import { PiBellSimpleLight } from "react-icons/pi";
import { GradientButton } from "../Buttons";
import { QrCode, Share2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { BranchProps } from "@/types/BranchType";



export function Header({branch}: {branch :BranchProps}){
    return(
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">{branch.name}</p>
                    <p className="text-[#666666] text-sm">{branch.address}</p>
                </div>
                <div className="flex items-center gap-4 ">
                    <GradientButton label="Sahe QR code" variant="outline" icon={<Share2 />} className="flex items-center gap-2 px-7" />
                    <GradientButton label="Download QR" variant="gradient" icon={<QrCode />} className="flex items-center gap-2 px-7"  onClick={() => signOut()} />
                    <div className="bg-[#F2F2F2] w-12 h-12 rounded-full flex justify-center items-center relative">
                    <PiBellSimpleLight size={30} />
                    <div className="w-2 h-2 rounded-full bg-[#FF4848] absolute right-3 bottom-4" />
                    </div>
                </div>
            </div>
            
        </div>
    )
}