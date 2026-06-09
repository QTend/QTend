
'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { useToast } from '@/context/ToastContext'
import { Eye, EyeOff, Store, Target } from 'lucide-react'
import { signIn, signOut, getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


export default function SignIn(){
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassord] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {showToast} = useToast()



  


  const handleNext = async () => {
    if(!email || !password)return;

    setIsLoading(true)

    try{
      const res = await signIn('user-credentials', {
        redirect: false,
        email,
        password
      })

     



      if(!res?.ok){
        console.log(res)
        showToast('Error while trying to login', 'error')
        return;
      }

       if (res?.error === "CredentialsSignin") {
        showToast("Invalid email or password", 'error' )
        return;
      }
      const session: any = await getSession()
       console.log('first', session.user.id)
      showToast('Login successful', 'success')
      router.push('/dashboard-redirect')
    }catch(error){
      console.error('Login failed:', error);
      showToast("Session error: ID not found", "error");
    }finally{
      setIsLoading(false)
    }
    
   }
  
  return (
    <section className='flex justify-center items-center min-h-screen bg-transaparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl'>
              <div className='bg-[#F67D26] w-16 h-16 flex justify-center items-center rounded-xl mx-auto'>
                <Store color='#ffffff' size={40} />
              </div>
              <h5 className='text-2xl font-medium font-space text-center' >Sign into your account</h5>
        
              <div className='mt-6 grid gap-1.5'>
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
              <Link href={'/'} className='text-[#F67D26] text-sm'>
              Forgot password
              </Link>
        
              <GradientButton 
              label='Sign in' variant='gradient'  disabled={!email || !password || isLoading}
              onClick={handleNext} className='w-full mt-6'
              />     

              <GradientButton 
              label='Sign in' variant='gradient' 
              onClick={() => signOut()} className='w-full mt-10'
                />     
                
          </div>
    </section>
  )
}
