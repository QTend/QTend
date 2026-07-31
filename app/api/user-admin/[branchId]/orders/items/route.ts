import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { connectToDB } from '@/utils/connectToDb';
import Order from '@/utils/models/OrderItem';
import { pusherServer } from '@/utils/pusher/pusher';

export async function PATCH(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { branchId } = resolvedParams;

    try {
        await connectToDB();

        const body = await req.json();
        const { orderId, itemId, itemStatus } = body; 

        if (!orderId || !itemId || !itemStatus) {
            return NextResponse.json({ error: 'Missing orderId, itemId, or itemStatus' }, { status: 400 });
        }

        // 🚀 THE FIX: Use the positional operator ($) to update just the nested item!
        const updatedOrder = await Order.findOneAndUpdate(
            { 
                _id: orderId, 
                "items._id": itemId // Find the specific order AND the specific item
            },
            { 
                $set: { "items.$.itemStatus": itemStatus } // Update only that matched item
            },
            { new: true } 
        ).populate('items.zoneId', 'name'); // Populate it just in case we need the zone names

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order or item not found' }, { status: 404 });
        }

        // Trigger real-time update so the admin dashboard (or other screens) can see it
        await pusherServer.trigger(`branch-${branchId}`, 'item-status-updated', {
            orderId,
            itemId,
            itemStatus
        });

        return NextResponse.json({ 
            success: true, 
            message: `Item marked as ${itemStatus}`,
            order: updatedOrder 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Item Update Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update item' }, { status: 500 });
    }
}