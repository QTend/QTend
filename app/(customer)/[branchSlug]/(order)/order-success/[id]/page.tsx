'use client'

import Button from '@/components/customer/ui/Button'
import { useCustomer } from '@/context/CustomerContext'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { FiCheckCircle } from 'react-icons/fi'

// Notice the page accepts BOTH branchId and orderId from Next.js dynamic routing
const SuccessPage = ({ params }: { params: Promise<{ branchSlug: string, id: string }> }) => {

  const resolvedParams = use(params);
   const { branchSlug, id } = resolvedParams;

  console.log(id)
  
  const [showModal, setShowModal] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [exactOrder, setExactOrder] = useState<any>(null)

  // ---> Look up the exact matching ID inside history <---
  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
      const foundMatch = storedOrders.find((order: any) => order._id === id)
      
      if (foundMatch) {
        setExactOrder(foundMatch)
      }
    } catch (e) {
      console.error("Could not trace order history matches", e);
    }
  }, [id])

  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleWaiter = () => {
    setShowModal(true)
    setCooldown(120) 
  }

  return (
    <section>
        <section className='mt-8'>
            <div className='bg-[#16A34A] w-28 h-28 mx-auto flex items-center justify-center rounded-full mb-8 shadow-sm'>
                <FiCheckCircle size={68} color='white' />
            </div>

            <p className='text-[#4B2E05] text-4xl font-bold text-center mb-2'>Order Received</p>
            <p className='text-[#92400E] text-center px-4'>Your order has been sent to the kitchen.</p>
        </section>

        <section className='p-6 bg-white mx-5 mt-8 mb-8 rounded-3xl shadow-sm border border-gray-50'>
            <div className='flex justify-between items-center py-3 border-b border-gray-50'>
                <p className='text-[#92400E] font-medium'>Order Number</p>
                <p className='text-[#4B2E05] font-bold text-lg'>
                  {exactOrder ? exactOrder.orderNumber : 'Loading...'}
                </p>
            </div>
            <div className='flex justify-between items-center py-3 border-b border-gray-50'>
                <p className='text-[#92400E] font-medium'>Table</p>
                <p className='text-[#4B2E05] font-bold'>
                  #{exactOrder ? exactOrder.tableNumber : '23'}
                </p>
            </div>
            <div className='flex justify-between items-center py-3'>
                <p className='text-[#92400E] font-medium'>Estimated Time</p>
                <p className='text-[#F97316] font-bold'>20 mins</p>
            </div>
        </section>

      {/* Buttons */}
      <Link href={`/${branchSlug}/menu`} className="block px-5 mt-7">
        <Button
          onClick={() =>{ }}
          bg='#F97316'
          text={'Back to Menu'}
        />
      </Link>

      <div className="px-5 mt-3 mb-6">
        <Button
          onClick={handleWaiter}
          bg='#fff'
          text={cooldown > 0 ? `Notify again (${cooldown}s)` : 'Request Waiter'}
          borderColor='#F97316'
          color='#F97316'
          disabled={cooldown > 0}
        />
      </div>
      
      <Link href={`/${branchSlug}/menu`} className='text-[#F97316] text-center font-bold block mb-10 active:scale-95 transition-transform'>
        View your active orders
      </Link>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[85%] max-w-sm text-center">
            <h3 className="text-[#4B2E05] font-bold text-xl mb-2">
              Request Sent
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              A request for waiter assistance has been sent. You can notify again after 2 minutes.
            </p>
            <Button onClick={() => setShowModal(false)} bg="#F97316" text="Okay" />
          </div>
        </div>
      )}
    </section>
  )
}

export default SuccessPage;