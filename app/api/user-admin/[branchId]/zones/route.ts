import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Zone from "@/utils/models/Zone";
import { randomBytes } from "crypto";

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

        // 🚀 UPDATED: Map the frontend payload and attach a secure, unique magic token
        const zonesToInsert = zone.map((z: any) => {
            // Creates a readable but unguessable token (e.g., "bar-8f7b2c9a0d")
            const safeName = z.zoneName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const secureString = randomBytes(5).toString('hex'); 
            
            return {
                branchId,
                name: z.zoneName,
                magicToken: `${safeName}-${secureString}` 
            };
        });

        // Bulk insert all drafted zones at once
        const insertedZones = await Zone.insertMany(zonesToInsert);

        return NextResponse.json({ 
            success: true, 
            message: `${insertedZones.length} zones successfully created`,
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