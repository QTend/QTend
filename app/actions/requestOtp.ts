import { optVerificationEmail } from "@/lib/sendEmails/otpVerificationEmail";
import { connectToDB } from "@/utils/connectToDb";
import otpVerificatoin from "@/utils/models/otpVerificatoin";

interface requestProps {
    email: string,
    type: string,
}

export async function requestOtp({email, type}: requestProps){

    try {
        await connectToDB()

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await otpVerificatoin.create({
            email,
            type,
            otp: code
        })

        try {
            await optVerificationEmail({
                email,
                otp: code
            })
        } catch (error) {
            console.error("Resend API failed, but DB save was successful:", error);
        }

        return { success: true, message: "OTP sent successfully" };


    } catch (error:any) {
         console.error("Failed to submit request:", error);
         return { success: false, message: error.message || "Something went wrong" };
    }
}