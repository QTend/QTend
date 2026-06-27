'use client'

import { IoIosClose } from 'react-icons/io'
import Button from '@/components/customer/ui/Button'
import { MenuItem } from '@/types/MenuItemType'

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFood: MenuItem | null;
  cart: any[];
  addToCart: (food: MenuItem) => void;
  removeCart: (id: string) => void;
}

export default function FoodDetailsModal({ 
  isOpen, 
  onClose, 
  selectedFood, 
  cart, 
  addToCart, 
  removeCart 
}: FoodDetailsModalProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div className={`relative w-full bg-white rounded-t-[2rem] transition-transform duration-500 flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '60%' }}>
        <div className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 shadow-sm backdrop-blur-md cursor-pointer">
          <IoIosClose size={28} onClick={onClose} />
        </div>
        {selectedFood?.image?.url ? (
          <img src={selectedFood.image.url} alt={selectedFood.name} className="h-2/5 w-full object-cover rounded-t-[2rem] shrink-0" />
        ) : (
          <div className="bg-orange-100 h-2/5 rounded-t-[2rem] w-full shrink-0 flex items-center justify-center">
            <p className="text-orange-400 font-medium">Image Preview</p>
          </div>
        )}
        {selectedFood && (
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-2 gap-4">
                <h6 className="text-3xl font-bold text-[#4B2E05]">{selectedFood.name}</h6>
                <span className="text-2xl font-bold text-[#F97316] shrink-0">₦{selectedFood.price.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 mb-4 overflow-y-auto max-h-32 leading-relaxed">{selectedFood.description}</p>
            </div>
            <div className="mt-auto pb-4">
              {cart.some((c: any) => c._id === selectedFood._id) ? (
                <Button onClick={() => { removeCart(selectedFood._id || ''); onClose(); }} bg='#1AB653' text='Remove From Cart' />
              ) : (
                <Button onClick={() => { addToCart(selectedFood); onClose(); }} bg='#F97316' text='Add To Cart' />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}