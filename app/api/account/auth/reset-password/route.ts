// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import otpVerificatoin from "@/utils/models/otpVerificatoin";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
    try {
        const { email, code, newPassword } = await req.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: "Email, code, and new password are required" }, { status: 400 });
        }

        // Password Regex: 8+ chars, 1 Uppercase, 1 Special Char (Matching your registration logic)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(newPassword)) {
            return NextResponse.json({ 
                error: 'Password must be 8+ characters with an uppercase letter and a special character.' 
            }, { status: 400 });
        }

        await connectToDB();

        // 1. Verify User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Find and Validate the OTP
        const otpRecord = await otpVerificatoin.findOne({ 
            email, 
            type: 'forgotPassword' 
        }).sort({ createdAt: -1 }); // Get the most recent one

        if (!otpRecord) {
            return NextResponse.json({ error: "Code expired or not found. Please request a new one." }, { status: 400 });
        }

        if (otpRecord.otp !== code) {
            return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update the user
        await User.findByIdAndUpdate(user._id, { 
            $set: { password: hashedPassword } 
        });
        
        // 5. Clean up: Delete the used OTP
        await otpVerificatoin.deleteMany({ email, type: 'passwordReset' });

        return NextResponse.json({ 
            success: true, 
            message: "Password reset successfully! You can now log in." 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};