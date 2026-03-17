'use client'

import Button from "@/components/customer/ui/Button";
import { Food } from "@/constant/foods";
import { CartItem, useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io"
import { LuDot } from "react-icons/lu"
import { RiDeleteBin6Line } from "react-icons/ri";

const OperationSymbol = ({sign, onClick, quantity}:{sign:string, onClick:any, quantity:number}) => {
  return(
    <div onClick={onClick} className=" bg-[#FFF7ED] flex justify-center items-center w-6 h-6 rounded-xl cursor-pointer">
      <span className="text-[#F97316] text-2xl flex items-center justify-center">
        {sign === '-' && quantity === 1 ? <RiDeleteBin6Line size={20} /> : sign}
      </span>

      
    </div>
  )
}

const page = () => {
   const {cart, setCart} = useCart();
   const router = useRouter()
   const [special, setSpecial] = useState('')


    const addQuantity = (item:number) => {
      setCart((prev: CartItem[]) => 
        prev.map(c => 
          c.id === item
          ? {...c, quantity: c.quantity + 1}
          : c
        )
      )
    }

    const removeQuantity = (itemId: number) => {
      setCart(prev =>
        prev
          .map(c => 
            c.id === itemId
              ? { ...c, quantity: c.quantity - 1 }
              : c
          )
          .filter(c => c.quantity > 0)
      );
    }


    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

     

  return (
    <section>
      {/* header */}
      <section className="bg-white p-5 mb-3"> 
        <div className="flex gap-3 items-center mb-3">
          <IoMdArrowBack color="#4B2E05" onClick={() => router.back()}/>
          <p className="text-[#4B2E05]">Back To Menu</p>
        </div>

        <p className="text-[#4B2E05]">Order Summary</p>
        <p className="text-[#92400E]">The Chef & Bar<LuDot className="inline" size={20} />Table 23</p>
        

      </section>

      {/* cart items */}
      <section className="pt-5 px-5 max-h-100 overflow-hidden overflow-y-scroll " style={{
            scrollbarWidth: "none",      // Firefox
            msOverflowStyle: "none",     // IE 10+
          }}>
        {cart.map(c => (
          <div key={c.id} className='bg-white p-3 flex gap-4 rounded-lg shadow mb-2'>
          {/* Image placeholder */}
          <div className='w-20 h-20 bg-orange-400 rounded-xl shrink-0' />
          
          {/* Name & Quantuty */}
          <div className='flex-1'> 
            <p className='text-[#4B2E05] leading-5 mb-3'>{c.name}</p>
            <div className="flex items-center gap-4 mb-3">
              <OperationSymbol onClick={() => removeQuantity(c.id)} sign={'-'} quantity={c.quantity} />
              <span>{c.quantity}</span>
              <OperationSymbol onClick={() => addQuantity(c.id)} sign={'+'} quantity={c.quantity} />
            </div>
            <p className=' text-[#92400E] mb-4'>₦{c.price * c.quantity}</p>
          </div>

          {/* Price */}
          <p className=' text-[#F97316]'>₦{c.price}</p>
        </div>
        ))}
      </section>

      {/* special instruction */}
      <section className="bg-white m-5 py-5 px-3 rounded-xl ">
        <h5 className="text-[#4B2E05] mb-2">Special INstructions (Optional)</h5>
        <div className="border border-[#FFEDD5] p-2">
          <textarea 
          value={special}
          onChange={(e) => setSpecial(e.target.value)}
          className="w-full focus:outline-none"
          placeholder="e.g no onions, extra spicy"
          /> 
        </div>
        
      </section>

      {/* Summary */}
      <section className="bg-white m-5 py-5 px-3 rounded-xl ">
        <div className="flex justify-between">
          <h5 className="text-[#92400E] mb-2 flex items-center gap-2"> <BsClockHistory />Estimated prep time</h5>
          <p className="text-[#92400E]">20mins</p>
        </div>
        <div className="flex justify-between">
          <h5 className="text-[#4B2E05]">Total</h5>
          <p className="text-[#92400E]">₦{totalPrice.toLocaleString()}</p>
        </div>
        
      </section>


     {/* Buttons */}
      <Link href={`/${'1'}/cart/summary`}  className=" block px-5 mb-2" >
        <Button
        onClick={() =>{ }}
        bg='#F97316'
        text={'Proceed'}
        />
      </Link>

      
     
    </section>
  )
}

export default page