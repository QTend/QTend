import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Zone from "@/utils/models/Zone";
import { randomBytes } from "crypto";

type RouteParams = {
  params: Promise<{
    branchId: string;
    zoneId: string;
  }>;
};

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        // 1. Authenticate the Manager
        const session: any = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        
        // Next.js 15+ requires awaiting params
        const resolvedParams = await params;
        const { branchId, zoneId } = resolvedParams;

        // 2. Find the Zone to get its name
        const zone = await Zone.findOne({ _id: zoneId, branchId });
        if (!zone) {
            return NextResponse.json({ error: "Zone not found" }, { status: 404 });
        }

        // 3. Generate the new token
        const safeName = zone.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const secureString = randomBytes(5).toString('hex'); 
        const newToken = `${safeName}-${secureString}`;

        // 4. Save to Database
        zone.magicToken = newToken;
        await zone.save();

        return NextResponse.json({ 
            success: true, 
            message: "Token reset successfully",
            token: newToken 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error resetting token:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}