'use client'

import { IoMdArrowBack } from 'react-icons/io'
import { LuDot } from 'react-icons/lu'
import { useRouter } from "next/navigation";
import { useCart } from '@/context/CartContext';
import Button from '@/components/customer/ui/Button';
import { useEffect, useState, use } from 'react'; 
import { useCustomer } from '@/context/CustomerContext';

const SummaryPage = () => { 
  const {branch, table} = useCustomer()
  const router = useRouter()
  const { cart, setCart } = useCart() 


  const [showModal, setShowModal] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  
  // ---> NEW: State to hold the special request <---
  const [specialRequest, setSpecialRequest] = useState("");

  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleRequestPOS = () => {
    setShowModal(true)
    setCooldown(120) 
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || isLoading) return;

    setIsLoading(true)

    try {
        const res = await fetch(`/api/${branch.restaurant.id}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tableNumber: table, 
                items: cart,
                totalAmount: totalPrice,
                specialInstructions: specialRequest 
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to place order");
        }

        const officialOrder = data.order;
        const existingOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
        const updatedOrders = [...existingOrders, officialOrder];
        
        localStorage.setItem('my_orders', JSON.stringify(updatedOrders));

        if (setCart) setCart([]); 
        localStorage.removeItem('cart');

       router.push(`/${branch.restaurant.slug}/order-success/${officialOrder._id}?table=${table}`);

    } catch (error: any) {
        console.error("Order error:", error);
        alert(error.message || "There was an issue placing your order. Please call the waiter.");
    }finally {
      setIsLoading(false)
    }
  };

  return (
    <section>
      {/* header */}
      <section className="bg-white p-5">
        <div className="flex gap-3 items-center mb-3">
          <IoMdArrowBack className="cursor-pointer" color="#4B2E05" onClick={() => router.back()} />
          <p className="text-[#4B2E05] font-medium cursor-pointer" onClick={() => router.back()}>Back To Menu</p>
        </div>

        <p className="text-[#4B2E05] font-bold text-2xl mt-4">Order Summary</p>
        <p className="text-[#92400E] flex items-center gap-1 mt-1">
          {branch.restaurant.name}
          <LuDot size={20} />
          Table {table}
        </p>
      </section>

      {/* order summary items */}
      <section className='px-5 pt-5 bg-white m-3 rounded-3xl shadow-sm border border-gray-50'>
        <p className="text-[#4B4B4B] text-sm mb-3">Items Review</p>

        {cart.map(c => (
          <div key={c._id} className='flex justify-between items-center py-2'>
            <p className="text-[#4B2E05] font-medium">{c.name} <span className="text-gray-400 ml-1">x {c.quantity}</span></p>
            <p className='text-[#92400E] font-medium'>₦{(c.price * c.quantity).toLocaleString()}</p>
          </div>
        ))}

        {/* ---> NEW: Special Instructions Input Box <--- */}
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[#4B4B4B] text-sm mb-2">Special Instructions (Optional)</p>
            <textarea 
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g., No onions, extra spicy, allergy to nuts..."
                className="w-full bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-sm text-[#4B2E05] placeholder:text-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none h-20"
            />
        </div>

        <div className='flex justify-between items-center py-4 mt-2 border-t border-t-[#FFEDD5]'>
          <p className="text-[#4B2E05] font-bold text-lg">Total Amount</p>
          <p className='text-[#F97316] font-bold text-2xl'>
            ₦{totalPrice.toLocaleString()}
          </p>
        </div>
      </section>

      {/* Place Order Button */}
      <div className="block px-5 mt-5">
        <Button
          onClick={handlePlaceOrder}
          bg='#F97316'
          text={cart.length > 0 ? (isLoading ? 'please wait...' : 'Place order') : 'Cart is empty'}
          disabled={cart.length === 0 || isLoading}
        />
      </div>

      {/* request pos */}
      <div className="px-5 mt-3 mb-8">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[85%] max-w-sm text-center">
            <h3 className="text-[#4B2E05] font-bold text-xl mb-2">
              Request Sent
            </h3>
            <p className="text-gray-500 text-sm mb-6">
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

export default SummaryPage