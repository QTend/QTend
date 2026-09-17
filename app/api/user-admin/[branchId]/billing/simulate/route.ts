import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import Branch from "@/utils/models/Branches"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

type RouteParams = {
    params: Promise<{ branchId: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;
        const { planId } = await req.json();

        // Map the IDs from your pricingData to your database string values
        const planMap: Record<number, string> = {
            1: 'basic',
            2: 'starter',
            3: 'pro'
        };
        const planString = planMap[planId] || 'basic';

        // Calculate 30 days from right now
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        // 🚀 THE MAGIC: Update the branch to end the trial and set the new 30-day expiry
        const updatedBranch = await Branch.findByIdAndUpdate(
            branchId,
            {
                $set: {
                    "plans.planType": planString,
                    "plans.isTrial": false,       // The trial is officially over
                    "plans.expiryDate": nextBillingDate // Added 30 days of access
                }
            },
            { new: true }
        );

        if (!updatedBranch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: "Subscription activated!", plan: planString },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Simulation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}