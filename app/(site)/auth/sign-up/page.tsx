
'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const page = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassord] = useState(false)
  const [loading, setLoading] = useState(false)

  const buttonDisable = !email || !password

   

  const handleNext = async() => {
    setLoading(true)
        // Regex for: 8 chars, 1 Uppercase, 1 Special
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  
      if (!passwordRegex.test(password)) {
          alert("Password is too weak! Ensure it has 8 chars, an uppercase letter, and a special character.");
          return;
      }
      try {
        const res = await fetch('/api/account/auth/register', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            email,
            password
          })
        })
        const data = await res.json()
  
        if (!res.ok) {
        // Use the error message sent from your catch block
        alert(data.error || "Something went wrong");
        return;
      }
  
        if(data.success){
          const result = await signIn('user-credentials', {
            redirect: false,
            email,
            password,
          });
          if (result?.error) {
            alert("Login failed after registration: " + result.error);
          } else {
            router.push('/onboarding/about-business');
          }
        }
      } catch (error) {
        console.error("Network or Parsing Error:", error);
      }finally {
        setLoading(false)
      }
    }
  
  return (
    <section className='flex justify-center items-center min-h-screen bg-transaparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl'>
        <div className='bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto'>
          <FaPhoneAlt color='#ffffff' size={24} />
        </div>
        <h5 className='text-2xl font-medium font-space text-center' >Create your account</h5>
        <p className='text-center text-black/80'>Enter your phone number to get started</p>
  
        <div className='mt-6 grid gap-2'>
          <label className='font-medium text-sm'>Email address</label>
          <input 
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter email address'
          className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
          />
        </div>

        <div className='mt-3 grid gap-2'>
          <label className='font-medium text-sm'>Password</label>
          <div className='relative'>
            <input 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter password'
            className='px-3 py-2 focus:outline-none w-full border-gray-300 border rounded-xl'
            />
            <div onClick={() => setShowPassord(!showPassword)} className='absolute top-2.5 right-5'>
              {
              showPassword
              ? <Eye size={20} />
              : <EyeOff size={20} />

            }
            </div>
          </div>
        </div>
    
        <GradientButton 
        label='Sign up' variant='gradient' disabled={buttonDisable}
        onClick={handleNext} className='w-full mt-5'
          />


        <p className='text-black/70 text-xs text-center mt-3'>By continuing, you agree to our Terms of Service and Privacy Policy</p>
    
            
      </div>
    </section>
  )
}

export default page