import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Zone from "@/utils/models/Zone";

type RouteParams = {
    params: Promise<{ branchId: string }>
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;
        
        const body = await req.json();
        const { zone } = body; 

        if (!zone || zone.length === 0) {
            return NextResponse.json({ error: "No zones provided" }, { status: 400 });
        }

        // Map the frontend payload (zoneName) to match our backend schema (name)
        const zonesToInsert = zone.map((zone: any) => ({
            branchId,
            name: zone.zoneName
        }));

        // Bulk insert all drafted zones at once
        const insertedZones = await Zone.insertMany(zonesToInsert);

        return NextResponse.json({ 
            success: true, 
            message: `${insertedZones.length} zones successfully created`,
            // Sending it back as 'newTables' so it perfectly matches your frontend's onSuccess expectation
            newTables: insertedZones 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating zones:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;

        const zones = await Zone.find({ branchId }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, zones }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching zones:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}