'use client'

import {AboutOne} from '@/components/userAdmin/screen/onboarding/AboutOne'
import { AboutThree } from '@/components/userAdmin/screen/onboarding/AboutThree'
import { AboutTwo } from '@/components/userAdmin/screen/onboarding/AboutTwo'
import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { useToast } from '@/context/ToastContext'
import { Store } from 'lucide-react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'


const categories = [
    'Resturnat',
    'Cafe',
    'Lounges',
    'Bar',
    'Food Truck',
    'Bakery'
]
const page = () => {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast()

  const handleDisable = !name || !category || !address


  const handleContinue = async() => {
    if (!name || !category || !address) {
      showToast("Please fill in all fields", 'warning');
      return;
    }

    setLoading(true);
     try {
      const res = await fetch('/api/branch/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to register business");
        return;
      }

      showToast(data.message, 'success')
      router.push(`/dashboard/${data.branch.slug}/menu`)
    } catch (error: any) {
      alert(error.message);
      showToast(error.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='flex justify-center items-center min-h-screen bg-transaparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl no-scrollbar'>
          <div >
            <div className='bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto mb-3'>
            <Store color='#ffffff' size={40} />
            </div>
            <h5 className='text-2xl text-center text-[#333333] font-medium'>Tell us about your business</h5>
            <p className='text-center text-[#666666]'>This helps us personalize your experience</p>

            <div className='mt-8 grid gap-2 mb-5'>
                <label htmlFor="" className='text-sm text-[#333333] font-bold'>Business name</label>
                <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='e.g Walmart'
                className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                />
            </div>

            <div className='grid gap-2 mb-5'>
                <label htmlFor="" className='text-sm text-[#333333] font-bold'>Business category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'>
                    <option className='text-gray-500'>Select Category</option>
                    {
                        categories.map((c, index) => (
                            <option key={index} value={c.toLocaleLowerCase()}>{c}</option>
                        ))
                    }
                </select>
            </div>

            <div className='grid gap-2 mb-10'>
                <label htmlFor="" className='font-bold text-sm text-[#333333]'>Business address</label>
                <input 
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder='e.g Walmart'
                className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                />
            </div>

            <GradientButton label='Continue' onClick={handleContinue} disabled={handleDisable} className='w-full' />
        </div>
      </div>
    </section>
  )
}

export default page