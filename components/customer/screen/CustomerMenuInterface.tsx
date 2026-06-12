'use client'

import Button from '@/components/customer/ui/Button'
import Order from '@/components/customer/ui/Order'
import { useCart } from '@/context/CartContext'
import { CategoryProps } from '@/types/MenuCategoyType'
import { MenuItem } from '@/types/MenuItemType'
import { useEffect, useMemo, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { IoIosArrowDown, IoIosClose } from 'react-icons/io'
import { FiBell } from 'react-icons/fi' 
import { LuDot } from 'react-icons/lu' // Needed for the Orders modal
import { useCustomer } from '@/context/CustomerContext'
import { pusherClient } from '@/utils/pusher/pusherClient'



export const CustomerMenuInterface = () => {
  const {branch, table} = useCustomer()
  // Category tracking
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All')
  
  // Cart & Food Modal state
  const { cart, setCart } = useCart()
  const [showMealDetails, setShowMealDetails] = useState(false)
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null)

  // Waiter & Orders Modal state
  const [showWaiterModal, setShowWaiterModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [myOrders, setMyOrders] = useState<any[]>([]) 



  // Load cart from localStorage
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

        // Instantly display what is in local storage
        setMyOrders([...storedOrders].reverse())

        // Fetch the real, current statuses from the database
        const orderIds = storedOrders.map((order: any) => order._id);
        const res = await fetch(`/api/${branch.restaurant.id}/orders/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIds })
        });

        const data = await res.json();

        if (data.success && data.statuses.length > 0) {
            let hasChanges = false;
            
            // Compare the Database reality vs the Phone's memory
            const updatedOrders = storedOrders.map((order: any) => {
                const dbMatch = data.statuses.find((dbOrder: any) => dbOrder._id === order._id);
                
                // If the DB says "Completed" but the phone still says "Active", update it!
                if (dbMatch && dbMatch.status !== order.status) {
                    hasChanges = true;
                    return { ...order, status: dbMatch.status };
                }
                return order;
            });

            // If the kitchen changed anything, save it to the phone and update the UI
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

 // --- REAL-TIME PUSHER LISTENER ---
  useEffect(() => {
    if (!branch?.restaurant.id) return;

    // 1. Tune into the exact same channel the kitchen broadcasts to
    const channelName = `branch-${branch.restaurant.id}`;
    const channel = pusherClient.subscribe(channelName);

    // 2. Listen for the specific event you created in your PATCH route
    channel.bind('order-status-updated', (updatedData: { _id: string, status: string }) => {
      
      // Pull the current memory from the phone
      const storedOrdersText = localStorage.getItem('my_orders');
      if (storedOrdersText) {
        const storedOrders = JSON.parse(storedOrdersText);
        let hasChanges = false;
        
        // Find the specific order and update its status
        const updatedStoredOrders = storedOrders.map((o: any) => {
          if (o._id === updatedData._id && o.status !== updatedData.status) {
            hasChanges = true;
            return { ...o, status: updatedData.status };
          }
          return o;
        });

        // If a change happened, save it to the phone AND update the UI
        if (hasChanges) {
          localStorage.setItem('my_orders', JSON.stringify(updatedStoredOrders));
          
          // Reverse it just like your loadAndSyncOrders function does!
          setMyOrders([...updatedStoredOrders].reverse());
        }
      }
    });

    // Cleanup to prevent memory leaks if they leave the page
    return () => {
      channel.unbind('order-status-updated');
      pusherClient.unsubscribe(channelName);
    };
  }, [branch?.restaurant.id]);

  // Lock scroll when ANY modal opens
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

  // --- Orders Logic ---
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

  // const handleCancelOrder = (orderId: string) => {
  //   const updatedOrders = myOrders.map(order => 
  //     order.id === orderId ? { ...order, status: 'Cancelled' } : order
  //   )
  //   setMyOrders(updatedOrders)
  //   localStorage.setItem('my_orders', JSON.stringify(updatedOrders.reverse())) 
  // }

  return (
    <section className={showSummary ? 'pb-40' : ''}>
      {/* ================= HEADER ================= */}
      <section className='bg-white'>
        <div className='flex justify-between items-start p-5'>
          
          {/* Left Side: Logo & Restaurant Info */}
          <div className='flex items-start gap-3'>
            <div className='bg-orange-400 w-16 h-16 rounded-xl shrink-0'/>
            <div className='flex flex-col'>
              <h2 className='text-3xl font-bold text-[#4B2E05] leading-tight mb-1'>
                {branch.restaurant.name}
              </h2>
              <p className='text-[#4B2E05] text-lg font-medium'>Table {table}</p>
            </div>
          </div>

          {/* Right Side: Action Buttons (Stacked Vertically) */}
          <div className='flex flex-col items-end gap-2 shrink-0'>
            
            {/* Call Waiter Button */}
            <button 
              onClick={() => setShowWaiterModal(true)}
              className="flex flex-col items-center justify-center bg-[#FFF7ED] text-[#F97316] p-2 px-3 rounded-xl shadow-sm border border-[#FFEDD5] transition-transform active:scale-95 touch-manipulation"
            >
              <FiBell size={24} className="mb-1 pointer-events-none" />
              <span className="text-xs font-bold pointer-events-none">Waiter</span>
            </button>

            {/* Conditional Orders Pill (Only shows if they have orders!) */}
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

        {/* Categories Horizontal Scroll */}
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

      {/* ================= MEALS LIST (Your existing code) ================= */}
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

      {/* Checkout Summary Bar */}
      {showSummary && <Order cart={cart} slug={branch.restaurant.slug} table={table} />}

      {/* ================= FOOD DETAILS MODAL ================= */}
      <div className={`fixed inset-0 z-50 flex items-end justify-center ${showMealDetails ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={() => setShowMealDetails(false)} className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${showMealDetails ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`relative w-full bg-white rounded-t-[2rem] transition-transform duration-500 flex flex-col ${showMealDetails ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '60%' }}>
          <div className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 shadow-sm backdrop-blur-md cursor-pointer">
            <IoIosClose size={28} onClick={() => setShowMealDetails(false)} />
          </div>
          {selectedFood?.image?.url ? (
            <img src={selectedFood.image.url} alt={selectedFood.name} className="h-2/5 w-full object-cover rounded-t-[2rem] shrink-0" />
          ) : (
            <div className="bg-orange-100 h-2/5 rounded-t-[2rem] w-full shrink-0 flex items-center justify-center"><p className="text-orange-400 font-medium">Image Preview</p></div>
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
                  <Button onClick={() => { removeCart(selectedFood._id || ''); setShowMealDetails(false); }} bg='#1AB653' text='Remove From Cart' />
                ) : (
                  <Button onClick={() => { addToCart(selectedFood); setShowMealDetails(false); }} bg='#F97316' text='Add To Cart' />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CALL WAITER MODAL ================= */}
      <div className={`fixed inset-0 z-60 flex items-end justify-center ${showWaiterModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={() => setShowWaiterModal(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${showWaiterModal ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`relative w-full bg-white rounded-t-4xl transition-transform duration-500 p-6 ${showWaiterModal ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#4B2E05]">Call Waiter</h3>
            <div className="bg-gray-100 rounded-full p-2 cursor-pointer" onClick={() => setShowWaiterModal(false)}><IoIosClose size={24} /></div>
          </div>
          <p className="text-gray-500 mb-5 font-medium">What do you need help with at Table {table}?</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { icon: '🚰', label: 'Need Water' }, { icon: '💳', label: 'Bring POS/Bill' },
              { icon: '🧹', label: 'Clean Table' }, { icon: '🙋', label: 'Order Question' }
            ].map((request) => (
              <button 
                key={request.label} onClick={() => { alert(`Sent to kitchen: ${request.label}`); setShowWaiterModal(false); }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors active:scale-95"
              >
                <span className="text-4xl mb-3">{request.icon}</span><span className="font-bold text-[#4B2E05]">{request.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MY ORDERS MODAL ================= */}
      <div className={`fixed inset-0 z-70 flex items-end justify-center ${showOrdersModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={() => setShowOrdersModal(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${showOrdersModal ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`relative w-full bg-gray-50 rounded-t-4xl transition-transform duration-500 flex flex-col h-[80vh] ${showOrdersModal ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-white p-6 rounded-t-4xl border-b border-gray-100 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-[#4B2E05]">My Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Your active session at Table 23</p>
            </div>
            <button type="button" className="bg-gray-100 rounded-full p-2 cursor-pointer touch-manipulation" onClick={() => setShowOrdersModal(false)}>
              <IoIosClose size={24} />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <div className="space-y-4 pb-10">
              {myOrders.map((order, index) => (
                <div key={order.id || index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Order #{order.id?.substring(0,6) || '10293'}</p>
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
                        <span className="text-[#4B2E05]"><span className="text-gray-400 mr-2">{item.quantity}x</span>{item.name}</span>
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
                    ) }
                    
                    {/* {order.status === 'Pending' && (
                      <button onClick={() => handleCancelOrder(order.id)} className="px-4 py-2.5 bg-red-50 text-red-500 font-bold text-sm rounded-xl active:scale-95 transition-transform">
                        Cancel
                      </button>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}