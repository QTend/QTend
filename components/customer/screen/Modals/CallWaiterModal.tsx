'use client'

import { IoIosClose } from 'react-icons/io'
import { useState } from 'react'

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: string;
  branchId: string; // <-- Make sure to pass the branch.restaurant.id from the parent!
}

export default function CallWaiterModal({ isOpen, onClose, table, branchId }: CallWaiterModalProps) {
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handleCallWaiter = async (requestType: string) => {
    setLoadingType(requestType);

    try {
        const res = await fetch(`/api/${branchId}/waiter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tableNumber: table,
                requestType: requestType
            })
        });

        if (!res.ok) throw new Error("Failed to call waiter");
        
        // Optionally show a success toast here
        onClose();
    } catch (error) {
        console.error("Waiter error:", error);
        alert("Failed to reach the waiter. Please try again.");
    } finally {
        setLoadingType(null);
    }
  }

  return (
    <div className={`fixed inset-0 z-60 flex items-end justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div className={`relative w-full bg-white rounded-t-4xl transition-transform duration-500 p-6 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#4B2E05]">Call Waiter</h3>
          <div className="bg-gray-100 rounded-full p-2 cursor-pointer" onClick={onClose}>
            <IoIosClose size={24} />
          </div>
        </div>
        <p className="text-gray-500 mb-5 font-medium">What do you need help with at Table {table}?</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: '🚰', label: 'Need Water' }, 
            { icon: '💳', label: 'Bring POS/Bill' },
            { icon: '🧹', label: 'Clean Table' }, 
            { icon: '🙋', label: 'Order Question' }
          ].map((request) => (
            <button 
              key={request.label} 
              onClick={() => handleCallWaiter(request.label)}
              disabled={loadingType !== null}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-colors active:scale-95 ${
                  loadingType === request.label 
                  ? 'border-orange-400 bg-orange-50 opacity-50' 
                  : 'border-gray-100 bg-gray-50 shadow-sm hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              <span className="text-4xl mb-3">
                  {loadingType === request.label ? '⏳' : request.icon}
              </span>
              <span className="font-bold text-[#4B2E05]">{request.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}