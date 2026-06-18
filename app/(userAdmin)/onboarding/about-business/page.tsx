'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { nigerianStates } from '@/constant/nigerianstates'
import { useToast } from '@/context/ToastContext'
import { Store, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'





const countries = ['Nigeria'] // Locked to Nigeria for now

const page = () => {
  const router = useRouter()
  
  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('Nigeria') 
  const [categories, setCategories] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  
  
  // UI State
  const [loading, setLoading] = useState(false);
  
  // We use a single string to track which dropdown is open so they don't overlap!
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'state' | 'country' | null>(null);
  
  const { showToast } = useToast()

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await fetch('/api/categories/create')
          const data = await res.json()
          if (res.ok && data.success) {
            setCategories(data.data)
          }
        } catch (error) {
          console.error('Error loading categories:', error)
        } finally {
          setFetching(false)
        }
      }
      fetchCategories()
    }, [])

  // Ensure all fields are filled before enabling the button
  const handleDisable = !name || !category || !address || !state || !country

  const handleContinue = async() => {
    if (handleDisable) {
      showToast("Please fill in all fields", 'warning');
      return;
    }

    setLoading(true);
     try {
      const res = await fetch('/api/branch/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sending 'state' instead of 'city'
        body: JSON.stringify({ name, category, address, state, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to register business", "error");
        return;
      }

      showToast(data.message, 'success')
      router.push(`/dashboard/${data.branch.slug}/menu`)
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false);
    }
  }

  // Helper to toggle dropdowns safely
  const toggleDropdown = (dropdownName: 'category' | 'state' | 'country') => {
      setActiveDropdown(prev => prev === dropdownName ? null : dropdownName);
  }

  return (
    <section className='flex justify-center items-center min-h-screen bg-transparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl no-scrollbar'>
          <div>
            <div className='bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto mb-3'>
                <Store color='#ffffff' size={40} />
            </div>
            <h5 className='text-2xl text-center text-[#333333] font-medium'>Tell us about your business</h5>
            <p className='text-center text-[#666666]'>This helps us personalize your experience</p>

            <div className='mt-8 grid gap-2 mb-5'>
                <label htmlFor="name" className='text-sm text-[#333333] font-bold'>Business name</label>
                <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='e.g Qtend Kitchen'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                />
            </div>

            {/* --- CATEGORY SELECT --- */}
            <div className='grid gap-2 mb-5 relative'>
                <label className='text-sm text-[#333333] font-bold'>Business category</label>
                <div 
                    onClick={() => toggleDropdown('category')}
                    className='px-3 py-2 flex justify-between items-center bg-white border-gray-300 border rounded-xl cursor-pointer select-none'
                >
                    {/* Updated state lookup: finding by _id instead of a string lowercase search */}
                    <span className={category ? 'text-[#333333]' : 'text-gray-400'}>
                        {category 
                        ? categories.find((c: any) => c._id === category)?.name 
                        : 'Select Category'}
                    </span>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                </div>

                {activeDropdown === 'category' && (
                    <div className='absolute z-20 top-18.75 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-48 overflow-y-auto'>
                        {categories.map((c: any) => (
                            <div 
                                key={c._id}
                                onClick={() => {
                                    setCategory(c._id); 
                                    setActiveDropdown(null);
                                }}
                                className='px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-[#333333] transition-colors capitalize'
                            >
                                {c.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <div className='grid gap-2 mb-5'>
                <label htmlFor="address" className='font-bold text-sm text-[#333333]'>Street address</label>
                <input 
                    id="address"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder='123 Main St'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                />
            </div>

            {/* State and Country side-by-side using Custom Selects */}
            <div className='grid grid-cols-2 gap-4 mb-10'>
                
                {/* --- STATE SELECT --- */}
                <div className='grid gap-2 relative'>
                    <label className='font-bold text-sm text-[#333333]'>State</label>
                    <div 
                        onClick={() => toggleDropdown('state')}
                        className='px-3 py-2 flex justify-between items-center bg-white border-gray-300 border rounded-xl cursor-pointer select-none'
                    >
                        <span className={`truncate mr-2 ${state ? 'text-[#333333]' : 'text-gray-400'}`}>
                            {state || 'Select State'}
                        </span>
                        <ChevronDown size={20} className={`text-gray-400 shrink-0 transition-transform duration-200 ${activeDropdown === 'state' ? 'rotate-180' : ''}`} />
                    </div>

                    {activeDropdown === 'state' && (
                        <div className='absolute z-30 top-[75px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-48 overflow-y-auto'>
                            {nigerianStates.map((s, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        setState(s);
                                        setActiveDropdown(null);
                                    }}
                                    className='px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-[#333333] transition-colors text-sm'
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- COUNTRY SELECT --- */}
                <div className='grid gap-2 relative'>
                    <label className='font-bold text-sm text-[#333333]'>Country</label>
                    <div 
                        onClick={() => toggleDropdown('country')}
                        className='px-3 py-2 flex justify-between items-center bg-white border-gray-300 border rounded-xl cursor-pointer select-none'
                    >
                        <span className='text-[#333333] truncate mr-2'>
                            {country}
                        </span>
                        <ChevronDown size={20} className={`text-gray-400 shrink-0 transition-transform duration-200 ${activeDropdown === 'country' ? 'rotate-180' : ''}`} />
                    </div>

                    {activeDropdown === 'country' && (
                        <div className='absolute z-30 top-[75px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-48 overflow-y-auto'>
                            {countries.map((c, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        setCountry(c);
                                        setActiveDropdown(null);
                                    }}
                                    className='px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-[#333333] transition-colors text-sm'
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <GradientButton 
                label='Continue' 
                onClick={handleContinue} 
                disabled={handleDisable} 
                loading={loading}
                className='w-full' 
            />
        </div>
      </div>
    </section>
  )
}

export default page