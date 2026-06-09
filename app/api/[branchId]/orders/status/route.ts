import { connectToDB } from '@/utils/connectToDb';
import OrderItem from '@/utils/models/OrderItem'; // Using OrderItem as you specified earlier!
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    try {
        await connectToDB();
        
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        // The phone sends an array of IDs it has saved in localStorage
        const body = await req.json();
        const { orderIds } = body; 

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json({ success: true, statuses: [] });
        }

        // .select('status') ensures we ONLY pull the status string, ignoring all the heavy food items
        const orders = await OrderItem.find(
            { _id: { $in: orderIds }, branchId: branchId },
            'status' 
        );

        return NextResponse.json({ success: true, statuses: orders }, { status: 200 });

    } catch (error: any) {
        console.error("Status Sync Error:", error);
        return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
    }
}