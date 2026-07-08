'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { useToast } from '@/context/ToastContext'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function maskEmail(email: any) {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const visiblePart = username.substring(0, 4); 
  return `${visiblePart}...@${domain}`;          
}

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawEmail = searchParams.get('email') || '';
    const maskedEmail = maskEmail(rawEmail);
    const { showToast } = useToast();

    // State Management
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!code || !newPassword || !confirmPassword) return;

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/account/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: rawEmail, 
                    code, 
                    newPassword 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            showToast(data.message, 'success');
            
            // Give them a moment to read the success toast, then route to login
            setTimeout(() => {
                router.push('/auth/sign-in');
            }, 2000);

        } catch (error: any) {
            showToast(error.message || "Something went wrong", "error");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <section className='flex justify-center items-center min-h-screen bg-transparent p-4'>
     <div className='bg-white p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-sm'>
            <div className='bg-[#F67D26] w-16 h-16 flex justify-center items-center rounded-xl mx-auto'>
                <Mail color='#ffffff' size={40} />
            </div>
            <h5 className='text-2xl font-medium font-space text-center mt-4'>Confirm it's you</h5>
            <p className='text-center text-[#666666] text-sm mt-2'>
                We sent a code to {maskedEmail}
            </p>
    
            <div className='mt-6 grid gap-1.5'>
                <label className='font-medium text-[#344054] text-sm'>Verification code</label>
                <input 
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Numbers only
                    placeholder='Enter 6-digit code'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl tracking-widest text-center font-semibold'
                    disabled={isLoading}
                />
            </div>

            <div className='mt-4 grid gap-1.5'>
                <label className='font-medium text-[#344054] text-sm'>New Password</label>
                <div className='relative'>
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='Enter new password'
                        className='px-3 py-2 focus:outline-none w-full border-gray-300 border rounded-xl'
                        disabled={isLoading}
                    />
                    <div onClick={() => setShowPassword(!showPassword)} className='absolute top-2.5 right-5 cursor-pointer text-gray-400 hover:text-gray-600'>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </div>
                </div>
            </div>

            <div className='mt-4 grid gap-1.5'>
                <label className='font-medium text-[#344054] text-sm'>Confirm New Password</label>
                <input 
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
                    disabled={isLoading}
                />
            </div>

            <GradientButton 
                label={isLoading ? 'Resetting...' : 'Reset Password'} 
                variant='gradient'  
                disabled={!code || !newPassword || !confirmPassword || isLoading}
                onClick={handleResetPassword} 
                className='w-full mt-6'
            />    
          </div>
    </section>
  )
}

export default Page