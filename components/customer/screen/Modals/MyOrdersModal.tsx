'use client'

import { IoIosClose } from 'react-icons/io'
import { LuDot } from 'react-icons/lu'

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  myOrders: any[];
  table: string;
  handleReorder: (items: any[]) => void;
}

export default function MyOrdersModal({ isOpen, onClose, myOrders, table, handleReorder }: MyOrdersModalProps) {
  return (
    <div className={`fixed inset-0 z-70 flex items-end justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div className={`relative w-full bg-gray-50 rounded-t-4xl transition-transform duration-500 flex flex-col h-[80vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white p-6 rounded-t-4xl border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-[#4B2E05]">My Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Your active session at Table {table}</p>
          </div>
          <button type="button" className="bg-gray-100 rounded-full p-2 cursor-pointer touch-manipulation" onClick={onClose}>
            <IoIosClose size={24} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="space-y-4 pb-10">
            {myOrders.map((order, index) => (
              <div key={order._id || order.id || index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Order #{order.orderNumber || (order.id?.substring(0,6)) || '10293'}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#4B2E05]">₦{order.totalAmount?.toLocaleString() || '0'}</p>
                      <LuDot className="text-gray-300" />
                      <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : order.status === 'Active' ? 'bg-blue-100 text-blue-600'  : 'bg-green-100 text-green-600'}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
                <div className="mb-4 space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-[#4B2E05]">
                        <span className="text-gray-400 mr-2">{item.quantity}x</span>{item.name}
                      </span>
                      <span className="text-gray-500">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <p className='text-[#4B2E05] text-sm'>{order.specialInstructions}</p>
                
                <div className="flex gap-2 pt-2">
                  {order.status === 'Completed' &&  (
                    <button onClick={() => handleReorder(order.items)} className="flex-1 py-2.5 bg-[#FFF7ED] text-[#F97316] font-bold text-sm rounded-xl border border-[#FFEDD5] active:scale-95 transition-transform">
                      Re-order Items
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}