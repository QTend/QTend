import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Use absolute alias for safety
import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/connectToDb";
import Membership from "@/utils/models/Membership";
import Branches from "@/utils/models/Branches";

export default async function DashboardRedirect() {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect('/auth/sign-in');
    }

    await connectToDB();

    const membership = await Membership.findOne({ userId: session.user.id }).lean();

    if (!membership || !membership.branchId) {
        redirect('/onboarding/about-business');
    }

    const branch = await Branches.findById(membership.branchId).lean();

    if (!branch || !branch.slug) {
        redirect('/onboarding/about-business'); 
    }

    // 4. Safe to redirect
    redirect(`/dashboard/${branch.slug}/menu`);
}