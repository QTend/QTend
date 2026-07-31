'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { useToast } from '@/context/ToastContext'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleRequestReset = async () => {
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/account/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request reset');
      }

      showToast(data.message, 'success');
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);

    } catch (error: any) {
      showToast(error.message || "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='flex justify-center items-center min-h-screen bg-transparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl'>
            <div className='bg-[#F67D26] w-16 h-16 flex justify-center items-center rounded-xl mx-auto'>
            <Lock color='#ffffff' size={40} />
            </div>
            <h5 className='text-2xl font-medium font-space text-center mt-4'>Forgot your password?</h5>
            <p className='text-center text-black/80 mt-2'>We can help you recover it in a simple step</p>
    
            <div className='mt-6 grid gap-1.5'>
                <label className='font-medium text-sm'>Email address</label>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email address'
                className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                disabled={isLoading}
                />
            </div>

            <GradientButton 
            label={isLoading ? 'Sending code...' : 'Continue'} 
            variant='gradient'  
            disabled={!email || isLoading}
            onClick={handleRequestReset} 
            className='w-full mt-6'
            />    
          </div>
    </section>
  )
}

export default Page