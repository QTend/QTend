'use client'

import { IoMdArrowBack } from 'react-icons/io'
import { LuDot } from 'react-icons/lu'
import { useRouter } from "next/navigation";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Button from '@/components/customer/ui/Button';
import { useEffect, useState } from 'react';

const page = () => {
  const router = useRouter()
  const { cart } = useCart()

  const [showModal, setShowModal] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // countdown logic
  useEffect(() => {
    if (cooldown === 0) return

    const timer = setInterval(() => {
      setCooldown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleRequestPOS = () => {
    setShowModal(true)
    setCooldown(120) // 2 minutes
  }

  return (
    <section>
      {/* header */}
      <section className="bg-white p-5">
        <div className="flex gap-3 items-center mb-3">
          <IoMdArrowBack color="#4B2E05" onClick={() => router.back()} />
          <p className="text-[#4B2E05]">Back To Menu</p>
        </div>

        <p className="text-[#4B2E05]">Order Summary</p>
        <p className="text-[#92400E]">
          The Chef & Bar
          <LuDot className="inline" size={20} />
          Table 23
        </p>
      </section>

      {/* order summary */}
      <section className='px-5 pt-5 bg-white m-3 rounded-3xl'>
        <p className="text-[#4B4B4B] text-sm">Order Summary</p>

        {cart.map(c => (
          <div key={c.id} className='flex justify-between items-center py-2'>
            <p className="text-[#4B2E05]">{c.name} x {c.quantity}</p>
            <p className='text-[#92400E]'>{c.price * c.quantity}</p>
          </div>
        ))}

        <div className='flex justify-between items-center py-3 border-t border-t-[#FFEDD5]'>
          <p className="text-[#4B2E05] font-semibold">Total Amount</p>
          <p className='text-[#92400E] font-semibold'>
            ₦{totalPrice.toLocaleString()}
          </p>
        </div>
      </section>

      {/* go to payment */}
      <Link href={`/${'1'}/order-success`} className="block px-5 mt-5">
        <Button
          onClick={() => { }}
          bg='#F97316'
          text={'Go to payment'}
        />
      </Link>

      {/* request pos */}
      <div className="px-5 mt-2">
        <Button
          onClick={handleRequestPOS}
          bg='#fff'
          text={cooldown > 0 ? `Notify again (${cooldown}s)` : 'Request POS for payment'}
          borderColor='#F97316'
          color='#F97316'
          disabled={cooldown > 0}
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[85%] max-w-sm text-center">
            <h3 className="text-[#4B2E05] font-semibold mb-2">
              Request Sent
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              A POS request has been sent to the waiter.  
              You can notify again after 2 minutes.
            </p>

            <Button
              onClick={() => setShowModal(false)}
              bg="#F97316"
              text="Okay"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default page
