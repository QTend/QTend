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

const page = () => {
  const { cart } = useCart();
  const router = useRouter()
  
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="flex flex-col h-screen">
      {/* header */}
      <section className="bg-white p-5 mb-3">
        <div className="flex gap-3 items-center mb-3">
          <IoMdArrowBack color="#4B2E05" onClick={() => router.replace('/1/menu')} />
          <p className="text-[#4B2E05]">Back To Menu</p>
        </div>

        <p className="text-[#4B2E05]">Order Summary</p>
        <p className="text-[#92400E]">
          The Chef & Bar
          <LuDot className="inline" size={20} />
          Table 23
        </p>
      </section>

      <div className="flex flex-col flex-1">
        {/* cart items */}
        <section
          className="pt-5 px-5 overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {cart.map(c => (
            <div
              key={c._id}
              className="bg-white p-3 flex gap-4 rounded-lg shadow mb-2"
            >
              {/* Image placeholder */}
              <div className="w-20 h-20 bg-orange-400 rounded-xl shrink-0" />

              {/* Name & Quantity */}
              <div className="flex-1">
                <p className="text-[#4B2E05] leading-5">{c.name}</p>
                <p className="text-gray-500">{c.quantity} item</p>
              </div>

              {/* Price */}
              <p className="text-[#F97316]">₦{c.price}</p>
            </div>
          ))}
        </section>

        {/* Summary (Pinned Bottom) */}
        <section className="bg-white m-5 py-5 px-3 rounded-xl mt-auto">
          <div className="flex justify-between">
            <h5 className="text-[#92400E] mb-2 flex items-center gap-2">
              <BsClockHistory /> Prep time remaining
            </h5>
            <p className="text-[#92400E]">20mins</p>
          </div>

          <div className="flex justify-between">
            <h5 className="text-[#4B2E05]">Total</h5>
            <p className="text-[#92400E]">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>
        </section>
      </div>
    </section>
  )
}

export default page
