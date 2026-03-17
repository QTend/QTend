'use client'

import Button from '@/components/customer/ui/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'

const page = () => {
  const [showModal, setShowModal] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown === 0) return

    const timer = setInterval(() => {
      setCooldown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])


  const handleWaiter = () => {
    setShowModal(true)
    setCooldown(120) // 2 minutes
  }
  return (
    <section>
        <section className='mt-3'>
            <div className='bg-[#16A34A] w-28 h-28 mx-auto flex items-center justify-center rounded-full mb-10'>
                <FiCheckCircle size={68} color='white' className=' ' />
            </div>

            <p className='text-[#4B2E05] text-6xl font-bold text-center'>Order Recieved</p>
            <p className='text-[#92400E] text-center mt-2'>Your order has beenm sent to the kitchen</p>
        </section>

        <section className='p-5 bg-white m-5 rounded-3xl'>
            <div className='flex justify-between items-center py-2'>
                <p className='text-[#92400E]'>Order Number</p>
                <p className='text-[#4B2E05]'>#5464</p>
            </div>
            <div className='flex justify-between items-center py-2'>
                <p className='text-[#92400E]'>Restaurant</p>
                <p className='text-[#4B2E05]'>#5464</p>
            </div>
            <div className='flex justify-between items-center py-2'>
                <p className='text-[#92400E]'>Estimated Time</p>
                <p className='text-[#92400E]'>15mins</p>
            </div>
        </section>

        {/* Buttons */}
      <Link href={`/${'1'}`}  className=" block px-5 mt-7" >
        <Button
        onClick={() =>{ }}
        bg='#F97316'
        text={'Place new order'}
        />
      </Link>

      <div className=" px-5 mt-2 mb-4" >
        <Button
        onClick={handleWaiter}
        bg='#fff'
        text={cooldown > 0 ? `Notify again (${cooldown}s)` : 'Request Waiter'}
        borderColor='#F97316'
        color='#F97316'
        disabled={cooldown > 0}
        />
      </div>
      <Link href={`/${'1'}/order`} className='text-[#F97316] text-center block mb-5'>
        View your order
      </Link>




       {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[85%] max-w-sm text-center">
            <h3 className="text-[#4B2E05] font-semibold mb-2">
              Request Sent
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              A request for waiter/assistance has been sent. You can notify again after 2 minutes."
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