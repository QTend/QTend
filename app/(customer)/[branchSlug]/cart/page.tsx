'use client'

import Button from "@/components/customer/ui/Button";
import { CartItem, useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io"
import { LuDot } from "react-icons/lu"
import { RiDeleteBin6Line } from "react-icons/ri";

const OperationSymbol = ({sign, onClick, quantity}:{sign:string, onClick: () => void, quantity:number}) => {
  return(
    <div onClick={onClick} className=" bg-[#FFF7ED] flex justify-center items-center w-6 h-6 rounded-xl cursor-pointer">
      <span className="text-[#F97316] text-2xl flex items-center justify-center">
        {sign === '-' && quantity === 1 ? <RiDeleteBin6Line size={20} /> : sign}
      </span>
    </div>
  )
}

// Capitalized 'Page' to fix React/Next.js warnings
const CartPage = ({ params }: { params: Promise<any> }) => {
  const {branchSlug} = use(params);
   const {cart, setCart} = useCart();
   const router = useRouter()
   const {table, branch} = useCustomer()



    // Fixed: item is now a string (MongoDB _id)
    const addQuantity = (itemId: string) => {
      setCart((prev: CartItem[]) => 
        prev.map(c => 
          c._id === itemId
          ? {...c, quantity: c.quantity + 1}
          : c
        )
      )
    }

    // Fixed: itemId is now a string
    const removeQuantity = (itemId: string) => {
      setCart(prev =>
        prev
          .map(c => 
            c._id === itemId
              ? { ...c, quantity: c.quantity - 1 }
              : c
          )
          .filter(c => c.quantity > 0)
      );
    }

    // This math now works perfectly because we changed price to 'number' in the type!
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );



  return (
    <section>
      {/* header */}
      <section className="bg-white p-5 mb-3"> 
        <div className="flex gap-3 items-center mb-3">
          <IoMdArrowBack className="cursor-pointer" color="#4B2E05" onClick={() => router.back()}/>
          <p className="text-[#4B2E05] font-medium">Back To Menu</p>
        </div>

        <p className="text-[#4B2E05] font-bold text-2xl mt-4">Order Summary</p>
        <p className="text-[#92400E] flex items-center gap-1 mt-1">{branch.restaurant.name}<LuDot size={20} />Table {table}</p>
      </section>

      {/* cart items */}
      <section className="pt-5 px-5 max-h-100 overflow-hidden overflow-y-scroll " style={{
            scrollbarWidth: "none",      // Firefox
            msOverflowStyle: "none",     // IE 10+
          }}>
        {cart.map(c => (
          <div key={c._id} className='bg-white p-3 flex gap-4 rounded-xl shadow-sm border border-gray-50 mb-3'>
          
          {/* Dynamic Image */}
          {c.image?.url ? (
             <img src={c.image.url} alt={c.name} className='w-20 h-20 rounded-xl object-cover shrink-0' />
          ) : (
             <div className='w-20 h-20 bg-orange-100 flex items-center justify-center text-xs text-orange-400 rounded-xl shrink-0'>No Image</div>
          )}
          
          {/* Name & Quantity */}
          <div className='flex-1'> 
            <p className='text-[#4B2E05] font-semibold leading-5 mb-3'>{c.name}</p>
            <div className="flex items-center gap-4 mb-3">
              <OperationSymbol onClick={() => removeQuantity(c._id)} sign={'-'} quantity={c.quantity} />
              <span className="font-medium text-[#4B2E05]">{c.quantity}</span>
              <OperationSymbol onClick={() => addQuantity(c._id)} sign={'+'} quantity={c.quantity} />
            </div>
            {/* Item Total */}
            <p className='text-[#92400E] font-medium'>₦{(c.price * c.quantity).toLocaleString()}</p>
          </div>

          {/* Unit Price */}
          <p className='text-[#F97316] font-bold'>₦{c.price.toLocaleString()}</p>
        </div>
        ))}
      </section>


      {/* Summary */}
      <section className="bg-white m-5 py-5 px-4 rounded-xl shadow-sm border border-gray-50">
        {/* <div className="flex justify-between mb-3">
          <h5 className="text-[#92400E] font-medium flex items-center gap-2"> <BsClockHistory />Estimated prep time</h5>
          <p className="text-[#92400E] font-bold">20 mins</p>
        </div> */}
        {/* border-t border-orange-100 pt-3 */}
        <div className="flex justify-between items-center  ">
          <h5 className="text-[#4B2E05] font-bold text-lg">Total</h5>
          <p className="text-[#F97316] font-bold text-2xl">₦{totalPrice.toLocaleString()}</p>
        </div>
      </section>

     {/* Buttons */}
      <div className="px-5 pb-8">
        <Link href={`/${branchSlug}/cart/summary?table=${table}`} className="block w-full" >
          <Button
          bg='#F97316'
          text={'Proceed to summary'}
          />
        </Link>
      </div>
    </section>
  )
}

export default CartPage;