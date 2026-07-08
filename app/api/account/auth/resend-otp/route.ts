// app/api/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import otpVerificatoin from "@/utils/models/otpVerificatoin";
import { requestOtp } from "@/app/actions/requestOtp";

export const POST = async (req: NextRequest) => {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "Account is already verified. Please log in." }, { status: 400 });
        }

        await otpVerificatoin.deleteMany({ email, type: 'emailVerification' });

        const otpResult = await requestOtp({ 
            email, 
            type: 'emailVerification',
        });

        if (!otpResult.success) {
            // Note: Even if Resend fails, requestOtp returns true because of the try/catch. 
            // This is just a fallback in case the database fails.
            return NextResponse.json({ error: otpResult.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "A new verification code has been sent to your email." 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Resend OTP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};