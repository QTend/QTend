import { connectToDB } from "@/utils/connectToDb";
import User from "@/utils/models/User";
import Membership from "@/utils/models/Membership"; // Import your Membership model
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Branches from "@/utils/models/Branches";

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
                            const activeMembership = await Membership.findOne({ userId: user._id.toString() });
                            let branchSlug = null;

                            // 3. Safely query the Branch collection manually if membership exists
                            if (activeMembership && activeMembership.branchId) {
                                // Fallback to fetching model metadata directly from Mongoose connection
                                const branch = await Branches.findById(activeMembership.branchId);
                                if (branch) {
                                    branchSlug = branch.slug;
                                }
                            }

                            return {
                                id: user._id.toString(),
                                email: user.email,
                                // Fallback to 'user-admin' type if no membership row exists yet
                                role: activeMembership ? activeMembership.role : 'user-admin',
                                // Extract the string slug from the populated branch reference
                                slug: branchSlug || null
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
