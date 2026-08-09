import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import Zone from "@/utils/models/Zone";
import Order from "@/utils/models/OrderItem"; 
import { pusherServer } from "@/utils/pusher/pusher";


export async function PATCH(req: NextRequest) {
    try {
        await connectToDB();

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: "Missing Magic Token" }, { status: 401 });
        }

        // 🚀 UPDATED: Selected 'name' so we can pass the zone name in the Pusher event
        const zone = await Zone.findOne({ magicToken: token }).select('name branchId');
        if (!zone) {
            return NextResponse.json({ error: "Invalid or revoked token" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, itemId, itemStatus } = body;

        //  updating the specific item in the array
        const updatedOrder = await Order.findOneAndUpdate(
            { 
                _id: orderId,
                branchId: zone.branchId, 
                "items._id": itemId 
            },
            { 
                $set: { "items.$.itemStatus": itemStatus } 
            },
            { new: true } // Returns the document AFTER the update is applied
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order or item not found" }, { status: 404 });
        }

        // ==========================================
        // 🚀 NEW: The "Ready to Serve" Logic
        // ==========================================
        // Check if every single item in this order is now 'Ready'
        const isOrderFullyReady = updatedOrder.items.every(
            (item: any) => item.itemStatus === 'Ready'
        );

        // Fire the real-time event to the Admin Dashboard
        await pusherServer.trigger(`branch-${zone.branchId}`, 'item-updated', {
            orderId: updatedOrder._id,
            itemId: itemId,
            itemStatus: itemStatus,
            isOrderFullyReady: isOrderFullyReady, // Send the true/false flag!
            zoneName: zone.name
        });
        // ==========================================

        return NextResponse.json({ success: true, message: "Item updated successfully", order: updatedOrder }, { status: 200 });

    } catch (error: any) {
        console.error("KDS PATCH Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}