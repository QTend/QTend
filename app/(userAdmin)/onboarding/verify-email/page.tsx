'use client'

import { GradientButton } from '@/components/userAdmin/ui/Buttons'
import { Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react' // Included Suspense

function maskEmail(email: any) {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const visiblePart = username.substring(0, 4); 
  return `${visiblePart}...@${domain}`;          
}

// 1. Core verification logic component
const VerifyEmailContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const rawEmail = searchParams.get('email') || '';

    const maskedEmail = maskEmail(rawEmail);

    // --- State Management ---
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | null, text: string }>({ type: null, text: '' });

    // --- Verify OTP Handler ---
    const handleVerification = async () => {
    if (!code || code.length !== 6) {
        setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit code.' });
        return;
    }

    setIsVerifying(true);
    setStatusMessage({ type: null, text: '' });

    try {
        const res = await fetch('/api/account/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: rawEmail, code }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Verification failed');
        }

        setStatusMessage({ type: 'success', text: data.message });
        
        
        const tempPassword = sessionStorage.getItem('temp_pass');
        
        if (tempPassword) {
            // Attempt to sign in with the newly verified email and temp password
            const loginRes = await signIn('user-credentials', {
                redirect: false,
                email: rawEmail,
                password: tempPassword
            });

            // Immediately clear it for security!
            sessionStorage.removeItem('temp_pass');

            if (loginRes?.ok) {
                router.push('/onboarding/about-business');
                return;
            }
        }

        // FALLBACK: If sessionStorage was empty or login failed for some reason, 
        // force them to manually log in instead of crashing.
        setTimeout(() => {
            router.push('/auth/sign-in'); // Note: Adjust this route to your actual sign-in page
        }, 1500);

    } catch (err: any) {
        setStatusMessage({ type: 'error', text: err.message || 'Something went wrong.' });
    } finally {
        setIsVerifying(false);
    }
}

    // --- Resend OTP Handler ---
    const handleResend = async () => {
        if (isResending) return;

        setIsResending(true);
        setStatusMessage({ type: null, text: '' });

        try {
            const res = await fetch('/api/account/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: rawEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to resend code');
            }

            setStatusMessage({ type: 'success', text: data.message });

        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message || 'Could not resend verification code.' });
        } finally {
            setIsResending(false);
        }
    }

    return (
        <section className='flex justify-center items-center h-screen'>
            <div className='bg-white p-6 min-w-125 rounded-lg shadow-sm'>
                <div className='bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto mb-3'>
                    <Mail color='#ffffff' size={40} />
                </div>
                <h5 className='text-2xl font-medium text-center text-[#333333]' >Verify your email address</h5>
                <p className='text-center text-[#666666]'>We sent a code to the email, {maskedEmail}</p>
            
                {/* --- Status Messages Display --- */}
                {statusMessage.type && (
                    <div className={`mt-4 p-3 text-sm rounded-xl text-center font-medium ${
                        statusMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                        {statusMessage.text}
                    </div>
                )}

                <div className='mt-5 grid gap-2 mb-10'>
                    <label className='font-medium text-[#344054] text-sm'>Verification code</label>
                    <input 
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Restricts input to numbers only
                        placeholder='Enter 6-digit code'
                        className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl tracking-widest text-center text-lg font-semibold'
                        disabled={isVerifying}
                    />
                </div>
            
                <GradientButton 
                    label={isVerifying ? 'Verifying...' : 'Verify and Continue'} 
                    variant='gradient' 
                    onClick={handleVerification} 
                    className='w-full'
                    disabled={isVerifying}
                />
            
                <p className='text-[#666666] text-xs text-center mt-3'>
                    Didn't receive code?{' '}
                    <span 
                        onClick={handleResend}
                        className={`text-[#F67D26] font-medium cursor-pointer select-none transition-opacity ${isResending ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                    >
                        {isResending ? 'Resending...' : 'Resend'}
                    </span>
                </p>
            </div>
        </section>
    )
}

// 2. Default export containing the Suspense Boundary wrapping your view
const Page = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading verification...
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}

export default Page
