import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import Zone from "@/utils/models/Zone";
import OrderItem from "@/utils/models/OrderItem";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        // Extract token directly from the URL
        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
        const timeframe = searchParams.get('timeframe') || 'today';

        if (!token) {
            return NextResponse.json({ error: "Missing Magic Token" }, { status: 401 });
        }

        // Ultra-Fast Lookup: Find the zone and get its branchId
        const zone = await Zone.findOne({ magicToken: token }).select('branchId');
        
        if (!zone) {
            return NextResponse.json({ error: "Invalid or revoked token" }, { status: 401 });
        }

        // Calculate Date Threshold
        const now = new Date();
        let dateThreshold = new Date();
        if (timeframe === 'today') {
            dateThreshold.setHours(0, 0, 0, 0); 
        } else if (timeframe === '7days') {
            dateThreshold.setDate(now.getDate() - 7);
        }

        // Fetch orders using the secure branchId tied to the token
        const orders = await OrderItem.find({ 
            branchId: zone.branchId,
            createdAt: { $gte: dateThreshold } 
        })
        .populate('items.zoneId', 'name')
        .sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            branchId: zone.branchId, 
            orders 
        }, { status: 200 });

    } catch (error: any) {
        console.error("KDS GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}