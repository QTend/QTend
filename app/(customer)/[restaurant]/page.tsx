'use client'

import Button from '@/components/customer/ui/Button'
import Order from '@/components/customer/ui/Order'
import { Food, foods } from '@/constant/foods'
import { useCart } from '@/context/CartContext'
import { useEffect, useMemo, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { IoIosArrowDown, IoIosClose } from 'react-icons/io'

const Page = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [foodCategory, setFoodCategory] = useState('All')
  const { cart, setCart } = useCart()

  const [showMealDetails, setShowMealDetails] = useState(false)

  // ✅ NEW: selected food
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  // After modal shows
  useEffect(() => {
    if (showMealDetails) {
      // Lock scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll
      document.body.style.overflow = ''
    }

    // Cleanup (important)
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMealDetails])

  const showSummary = cart.length > 0

  const filterMenu =
    foodCategory === 'All'
      ? foods
      : foods.filter(food => food.category === foodCategory)

  const uniqueCategories = useMemo(
    () => ['All', ...new Set(foods.map(food => food.category))],
    []
  )

  const uniqueTypes = useMemo(
    () => [...new Set(filterMenu.map(food => food.type))],
    [filterMenu]
  )

  const handleToggleMenu = (type: string) => {
    setOpenMenus(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const addToCart = (food: Food) => {
    setCart(prev =>[...prev, { ...food, quantity: 1 }])
  }



  const removeCart = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id))
  }

  return (
    <section className={showSummary ? 'pb-40' : ''}>
      {/* HEADER */}
      <section className='bg-white '>
        <div className='flex items-start gap-3 p-5'>
          {/* Logo */}
          <div className='bg-orange-400 w-20 h-14 rounded-xl'/>

          {/* Product Name + Table */}
          <div className='flex flex-col'>
            <h2 className='text-6xl font-bold text-[#4B2E05] leading-11 mb-2'>Product name</h2>
            <p className='text-[#4B2E05] text-xl font-medium'>Table 23</p>
          </div>
        </div>

        {/* Categories scroll */}
        <div
          className="flex gap-2 overflow-x-auto mt-5 pb-5 px-2"
          style={{
            scrollbarWidth: "none",      // Firefox
            msOverflowStyle: "none",     // IE 10+
          }}
        >
          {uniqueCategories.map(category => (
            <div 
              key={category} 
              onClick={() => setFoodCategory(category)}
              className={`px-5 py-1 rounded-full flex items-center gap-3 cursor-pointer ${
                foodCategory === category ? 'bg-[#F97316] text-white' : 'bg-gray-200 text-[#4B2E05]'
              }`}
            >
              {/* <div className={`w-5 h-5 rounded-full ${foodCategory === category ? 'bg-white' : 'bg-gray-400'}`}/> */}
              <p>{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MEALS */}
      <section className="px-5 pt-3">
        {uniqueTypes.map(type => {
          const foodOfType = filterMenu.filter(f => f.type === type)

          return (
            <div key={type} className="mb-4">
              <div
                onClick={() => handleToggleMenu(type)}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <p className="text-2xl text-[#4B2E05]">{type}</p>
                <IoIosArrowDown
                  className={`transition-transform ${
                    openMenus.includes(type) ? 'rotate-180' : ''
                  }`}
                />
              </div>

              <div
                className={`transition-all duration-500 overflow-hidden ${
                  openMenus.includes(type)
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                {foodOfType.map(food => {
                  const hasAdded = cart.some(c => c.id === food.id)

                  return (
                    <div
                      key={food.id}
                      className="bg-white p-3 flex gap-4 rounded-lg shadow mb-2"
                    >
                      <div className="w-20 h-20 bg-orange-400 rounded-xl" />

                      {/* ✅ SET selected food */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedFood(food)
                          setShowMealDetails(true)
                        }}
                      >
                        <p className="text-xl font-semibold text-[#4B2E05]">
                          {food.name}
                        </p>
                        <p className="text-sm text-[#4B2E05] line-clamp-1">
                          {food.description}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#F97316] font-bold mb-4">
                          ₦{food.price}
                        </p>
                        <div
                          onClick={() =>
                            hasAdded
                              ? removeCart(food.id)
                              : addToCart(food)
                          }
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            hasAdded ? 'bg-green-400' : 'bg-[#F97316]'
                          }`}
                        >
                          <GoPlus color="white" size={30} />
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

      {showSummary && <Order cart={cart} />}

      {/* ================= MODAL ================= */}
      <div
        className={`fixed inset-0 z-50 flex items-end justify-center ${
          showMealDetails ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setShowMealDetails(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            showMealDetails ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Bottom Sheet */}
        <div
          className={`relative w-full bg-white rounded-t-3xl transition-transform duration-500 ${
            showMealDetails ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ height: '50%' }}
        >
          <IoIosClose
            size={40}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => setShowMealDetails(false)}
          />

          <div className="bg-orange-400 h-1/2 rounded-t-3xl" />

          {selectedFood && (
            <div className="p-4">
              <div className="flex justify-between mb-3">
                <h6 className="text-2xl text-[#4B2E05]">
                  {selectedFood.name}
                </h6>
                <span className="text-2xl text-[#F97316]">
                  ₦{selectedFood.price}
                </span>
              </div>

              <p className="text-[#92400E] mb-4">
                {selectedFood.description}
              </p>

              {
                cart.some(c => c.id === selectedFood.id) 
                ? <Button 
                  onClick={() =>{removeCart(selectedFood.id);  setShowMealDetails(false)}}
                  bg='#1AB653' 
                  text={'Remove From Cart'}
                  />
              : <Button 
                  onClick={() =>{ addToCart(selectedFood); setShowMealDetails(false)}}
                  bg='#F97316'
                  text={'Add To Cart'}
                  />
              }

              
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Page
