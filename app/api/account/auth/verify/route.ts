// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import otpVerificatoin from "@/utils/models/otpVerificatoin";

export const POST = async (req: NextRequest) => {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        await connectToDB();

        
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "Account is already verified. Please log in." }, { status: 200 });
        }

        const otpRecord = await otpVerificatoin.findOne({ 
            email, 
            type: 'emailVerification' 
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return NextResponse.json({ error: "Code expired or not found. Please request a new one." }, { status: 400 });
        }

      
        if (otpRecord.otp !== code) {
            return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
        }

        
        await User.findByIdAndUpdate(user._id, { $set: { isVerified: true } });
        
        
        await otpVerificatoin.deleteMany({ email });

        return NextResponse.json({ 
            success: true, 
            message: "Email verified successfully!" 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};