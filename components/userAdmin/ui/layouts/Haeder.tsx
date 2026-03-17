import { FaQrcode } from "react-icons/fa";
import { HiOutlineQrCode } from "react-icons/hi2";
import { PiBellSimpleLight } from "react-icons/pi";



export function Header(){
    return(
        <div className=" bg-white py-5">
            <div className="max-w-7xl flex justify-between mx-auto ">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">Mama's Kitchen</p>
                    <p className="text-[#666666] text-sm">menu.menuqr.app/mama's-kitchen</p>
                </div>
                <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-2 font-medium text-sm bg-orange-400 px-6 py-2 rounded-lg text-white"><FaQrcode /> Download QR
                    </div>
                    <PiBellSimpleLight size={28} />
                </div>
            </div>
            
        </div>
    )
}