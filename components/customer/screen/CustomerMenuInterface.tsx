'use client'

import Order from '@/components/customer/ui/Order'
import { useCart } from '@/context/CartContext'
import { MenuItem } from '@/types/MenuItemType'
import { useEffect, useMemo, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { IoIosArrowDown } from 'react-icons/io'
import { FiBell } from 'react-icons/fi' 
import { useCustomer } from '@/context/CustomerContext'
import { pusherClient } from '@/utils/pusher/pusherClient'

// Import our new modals
import CallWaiterModal from './Modals/CallWaiterModal'
import FoodDetailsModal from './Modals/FoodDetailsModal'
import MyOrdersModal from './Modals/MyOrdersModal'

export const CustomerMenuInterface = () => {
  const { branch, table } = useCustomer()
  
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All')
  
  const { cart, setCart } = useCart()
  const [showMealDetails, setShowMealDetails] = useState(false)
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null)

  const [showWaiterModal, setShowWaiterModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [myOrders, setMyOrders] = useState<any[]>([]) 

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) setCart(JSON.parse(storedCart))
    } catch (e) {
      localStorage.removeItem('cart')
    }
  }, [setCart])

  useEffect(() => {
    const loadAndSyncOrders = async () => {
      try {
        const storedOrdersText = localStorage.getItem('my_orders')
        if (!storedOrdersText) return;

        const storedOrders = JSON.parse(storedOrdersText)
        if (storedOrders.length === 0) return;

        setMyOrders([...storedOrders].reverse())

        const orderIds = storedOrders.map((order: any) => order._id);
        const res = await fetch(`/api/${branch.restaurant.id}/orders/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIds })
        });

        const data = await res.json();

        if (data.success && data.statuses.length > 0) {
            let hasChanges = false;
            
            const updatedOrders = storedOrders.map((order: any) => {
                const dbMatch = data.statuses.find((dbOrder: any) => dbOrder._id === order._id);
                if (dbMatch && dbMatch.status !== order.status) {
                    hasChanges = true;
                    return { ...order, status: dbMatch.status };
                }
                return order;
            });

            if (hasChanges) {
                localStorage.setItem('my_orders', JSON.stringify(updatedOrders));
                setMyOrders(updatedOrders.reverse()); 
            }
        }
      } catch (error) {
        console.error("Failed to sync orders on load", error);
      }
    }

    loadAndSyncOrders();
  }, [branch.restaurant.id])

  useEffect(() => {
    if (!branch?.restaurant.id) return;

    const channelName = `branch-${branch.restaurant.id}`;
    const channel = pusherClient?.subscribe(channelName);

    channel?.bind('order-status-updated', (updatedData: { _id: string, status: string }) => {
      const storedOrdersText = localStorage.getItem('my_orders');
      if (storedOrdersText) {
        const storedOrders = JSON.parse(storedOrdersText);
        let hasChanges = false;
        
        const updatedStoredOrders = storedOrders.map((o: any) => {
          if (o._id === updatedData._id && o.status !== updatedData.status) {
            hasChanges = true;
            return { ...o, status: updatedData.status };
          }
          return o;
        });

        if (hasChanges) {
          localStorage.setItem('my_orders', JSON.stringify(updatedStoredOrders));
          setMyOrders([...updatedStoredOrders].reverse());
        }
      }
    });

    return () => {
      channel?.unbind('order-status-updated');
      pusherClient?.unsubscribe(channelName);
    };
  }, [branch?.restaurant.id]);

  useEffect(() => {
    if (showMealDetails || showWaiterModal || showOrdersModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMealDetails, showWaiterModal, showOrdersModal])

  const showSummary = cart.length > 0

  const allCategories = useMemo(
    () => [{ _id: 'All', name: 'All' }, ...branch.menu.categories],
    [branch.menu.categories]
  )

  const categoriesToDisplay = useMemo(() => {
    return selectedCategoryId === 'All' 
      ? branch.menu.categories 
      : branch.menu.categories.filter(c => c._id === selectedCategoryId)
  }, [selectedCategoryId, branch.menu.categories])

  const handleToggleMenu = (categoryId: string) => {
    setOpenMenus(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const addToCart = (food: MenuItem) => {
    setCart((prev: any) => [...prev, { ...food, quantity: 1 }])
  }

  const removeCart = (id: string) => {
    setCart((prev: any[]) => prev.filter(item => item._id !== id))
  }

  const handleReorder = (itemsToReorder: any[]) => {
    setCart((prev: any[]) => {
      const newCart = [...prev];
      itemsToReorder.forEach(newItem => {
        const existing = newCart.find(c => c._id === newItem._id);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          newCart.push({ ...newItem });
        }
      });
      return newCart;
    });
    setShowOrdersModal(false);
  }

  return (
    <section className={showSummary ? 'pb-40' : ''}>
      {/* ================= HEADER ================= */}
      <section className='bg-white'>
        <div className='flex justify-between items-start p-5'>
          
          <div className='flex items-start gap-3'>
            <div className='bg-orange-400 w-16 h-16 rounded-xl shrink-0'/>
            <div className='flex flex-col'>
              <h2 className='text-3xl font-bold text-[#4B2E05] leading-tight mb-1'>
                {branch.restaurant.name}
              </h2>
              <p className='text-[#4B2E05] text-lg font-medium'>Table {table}</p>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2 shrink-0'>
            
            <button 
              onClick={() => setShowWaiterModal(true)}
              className="flex flex-col items-center justify-center bg-[#FFF7ED] text-[#F97316] p-2 px-3 rounded-xl shadow-sm border border-[#FFEDD5] transition-transform active:scale-95 touch-manipulation"
            >
              <FiBell size={24} className="mb-1 pointer-events-none" />
              <span className="text-xs font-bold pointer-events-none">Waiter</span>
            </button>

            {myOrders.length > 0 && (
              <button 
                onClick={() => setShowOrdersModal(true)}
                className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 py-1.5 px-3 rounded-full shadow-sm active:scale-95 touch-manipulation transition-all"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[11px] font-bold whitespace-nowrap">
                  {myOrders.length} active order{myOrders.length > 1 ? 's' : ''}
                </span>
              </button>
            )}
          </div>
          
        </div>

        <div
          className="flex gap-2 overflow-x-auto mt-2 pb-5 px-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allCategories.map(category => (
            <div 
              key={category._id} 
              onClick={() => {
                setSelectedCategoryId(category._id)
                if (category._id !== 'All' && !openMenus.includes(category._id)) {
                  setOpenMenus(prev => [...prev, category._id])
                }
              }}
              className={`px-5 py-2 rounded-full flex items-center gap-3 cursor-pointer whitespace-nowrap transition-colors touch-manipulation ${
                selectedCategoryId === category._id ? 'bg-[#F97316] text-white shadow-md' : 'bg-gray-100 text-[#4B2E05]'
              }`}
            >
              <p className="font-medium pointer-events-none">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MEALS LIST ================= */}
      <section className="px-5 pt-3">
        {categoriesToDisplay.map(category => {
          const foodsInCategory = branch.menu.items.filter(item => item.categoryId === category._id)
          if (foodsInCategory.length === 0) return null

          return (
            <div key={category._id} className="mb-4">
              <div
                onClick={() => handleToggleMenu(category._id)}
                className="flex items-center gap-2 mb-3 cursor-pointer touch-manipulation"
              >
                <p className="text-2xl text-[#4B2E05] font-bold pointer-events-none">{category.name}</p>
                <IoIosArrowDown className={`transition-transform pointer-events-none ${openMenus.includes(category._id) ? 'rotate-180' : ''}`} />
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${openMenus.includes(category._id) ? 'max-h-1250 opacity-100' : 'max-h-0 opacity-0'}`}>
                {foodsInCategory.map(food => {
                  const hasAdded = cart.some((c: any) => c._id === food._id)
                  return (
                    <div key={food._id} className="bg-white p-3 flex gap-4 rounded-2xl shadow-sm border border-gray-100 mb-3">
                      {food.image?.url ? (
                        <img src={food.image.url} alt={food.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-24 h-24 bg-orange-100 rounded-xl shrink-0 flex items-center justify-center text-orange-400 text-xs text-center p-2 font-medium">No Image</div>
                      )}
                      <div className="flex-1 cursor-pointer py-1 touch-manipulation" onClick={() => { setSelectedFood(food); setShowMealDetails(true); }}>
                        <p className="text-lg font-bold text-[#4B2E05] leading-tight mb-1">{food.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{food.description}</p>
                      </div>
                      <div className="flex flex-col justify-between items-end py-1">
                        <p className="text-[#F97316] font-bold text-lg">₦{food.price.toLocaleString()}</p>
                        <div onClick={() => hasAdded ? removeCart(food._id || '') : addToCart(food)} className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm touch-manipulation active:scale-90 ${hasAdded ? 'bg-green-500' : 'bg-[#F97316]'}`}>
                          <GoPlus color="white" size={24} className={hasAdded ? "rotate-45 transition-transform pointer-events-none" : "transition-transform pointer-events-none"} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      {showSummary && <Order cart={cart} slug={branch.restaurant.slug} table={table} />}

      {/* ================= MODALS ================= */}
      <CallWaiterModal 
        isOpen={showWaiterModal} 
        onClose={() => setShowWaiterModal(false)} 
        table={table ?? ''} 
        branchId={branch?.restaurant.id}
      />

      <FoodDetailsModal 
        isOpen={showMealDetails}
        onClose={() => setShowMealDetails(false)}
        selectedFood={selectedFood}
        cart={cart}
        addToCart={addToCart}
        removeCart={removeCart}
      />

      <MyOrdersModal 
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
        myOrders={myOrders}
        table={table ?? ''}
        handleReorder={handleReorder}
      />

    </section>
  )
}