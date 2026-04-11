import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "user-credentials",
            name: 'Create user account',
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: any) {
                await connectToDB()
                try {
                    const user =await User.findOne({email: credentials.email});
                    if(user){
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                             user.password
                        )
                        if(isPasswordCorrect){
                            return {
                                id: user._id,
                                email: user.email
                            }
                        }
                    }
                    return null;
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.userID = user.id
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.userID;
            }
            return session;
        },
    }
}