import { CartItem } from "@/context/CartContext";
import Link from "next/link";
import { RiShoppingBag4Line } from "react-icons/ri"

const Order = ({ cart }:{cart :CartItem[]}) => {

  const totalPrice = cart.reduce((sum: any, item:any) => sum + item.price * item.quantity , 0);

  return (
    <Link href={`/${'1'}/cart`} className="bg-[#4B2E05] py-3 px-5 rounded-2xl fixed bottom-5 right-6">
      <div className="flex items-center gap-4">

        <div className="relative">
          <RiShoppingBag4Line size={28} color="#FFFFFF" />

          {/* Notification Count */}
          <div className="bg-[#F97316] w-5 h-5 text-[12px] absolute -top-1 -right-2 rounded-full flex items-center justify-center">
            <p className="text-white">{cart.length}</p>
          </div>
        </div>

        <div>
          <p className="text-[12px] text-white/80 font-light">Order summary</p>
          <p className="text-white font-bold">₦{totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  )
}

export default Order;






