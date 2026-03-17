import { FaQrcode } from "react-icons/fa";
import { HiOutlineQrCode } from "react-icons/hi2";
import { PiBellSimpleLight } from "react-icons/pi";
import { GradientButton } from "../Buttons";
import { QrCode, Share2 } from "lucide-react";



export function Header(){
    return(
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">Mama's Kitchen</p>
                    <p className="text-[#666666] text-sm">menu.menuqr.app/mama's-kitchen</p>
                </div>
                <div className="flex items-center gap-4 ">
                    <GradientButton label="Sahe QR code" variant="outline" icon={<Share2 />} className="flex items-center gap-2 px-7" />
                    <GradientButton label="Download QR" variant="gradient" icon={<QrCode />} className="flex items-center gap-2 px-7" />
                    <div className="bg-[#F2F2F2] w-12 h-12 rounded-full flex justify-center items-center relative">
                    <PiBellSimpleLight size={30} />
                    <div className="w-2 h-2 rounded-full bg-[#FF4848] absolute right-3 bottom-4" />
                    </div>
                </div>
            </div>
            
        </div>
    )
}