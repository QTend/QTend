import { NextRequest, NextResponse } from "next/server";
import {connectToDB} from "@/utils/connectToDb"
import User from "@/utils/models/User";
import bcrypt from "bcryptjs";



export const POST = async(req: NextRequest) => {
    try {

        console.log(' working ')
        const  { email, password } = await req.json();


         if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and Password are required' },
                { status: 400 }
            );
        }

        // Password Regex: 8+ chars, 1 Uppercase, 1 Special Char
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: 'Password must be 8+ characters with an uppercase letter and a special character.' },
                { status: 400 }
            );
        }

        await connectToDB()
        

        const existAccount = await User.findOne({email})
        if(existAccount){
            return NextResponse.json(
                {error: 'Account already exist'},
                {status: 400}
            )
        }

        const hashPassword = await bcrypt.hash(password, 10)


        await User.create({
            email,
            password: hashPassword,
            isFoundingMember: true
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
        },
        {status: 201}
        )
    } catch (error: any) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }

    
}