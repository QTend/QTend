import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import otpVerificatoin from "@/utils/models/otpVerificatoin";
import { passwordResetEmail } from "@/app/actions/passwordResetEmail";

export const POST = async (req: NextRequest) => {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
        }

        await otpVerificatoin.deleteMany({ email, type: 'passwordReset' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await otpVerificatoin.create({
            email,
            type: 'forgotPassword',
            otp: code
        });

        try {
            await passwordResetEmail ({ email, otp: code });
        } catch (emailError) {
            console.error("Password reset email failed to send:", emailError);
        }

        return NextResponse.json({ 
            success: true, 
            message: "If an account exists, a reset code has been sent." 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};