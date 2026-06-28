import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import Membership from "@/utils/models/Membership"; // Import your Membership model
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
                await connectToDB();
                try {
                    // 1. Authenticate the core user profile
                    const user = await User.findOne({ email: credentials.email });
                    
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isPasswordCorrect) {
                            // 2. Query the Membership table to find their active workspace
                            // We populate 'branchId' to pull the unique slug out of it
                            const activeMembership = await Membership.findOne({ userId: user._id })
                            .populate("branchId");

                            return {
                                id: user._id.toString(),
                                email: user.email,
                                // Fallback to 'user-admin' type if no membership row exists yet
                                role: activeMembership ? activeMembership.role : 'user-admin',
                                // Extract the string slug from the populated branch reference
                                slug: activeMembership?.branchId?.slug || null
                            };
                        }
                    }
                    return null;
                } catch (error: any) {
                    console.log('cre', error);
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
        async jwt({ token, user }) {
            if (user) {
                token.userID = user.id;
                token.role = (user as any).role;
                token.slug = (user as any).slug;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.userID;
                (session.user as any).role = token.role;
                (session.user as any).slug = token.slug;
            }
            return session;
        },
    }
};
