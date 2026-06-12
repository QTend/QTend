import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { connectToDB } from '@/utils/connectToDb';
import OrderItem from '@/utils/models/OrderItem';
import { pusherServer } from '@/utils/pusher/pusher';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// =======================================================================
// GET: Kitchen Admin fetches orders for their dashboard
// =======================================================================
export async function GET(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        await connectToDB();

        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        // Fetch all orders for this branch, newest first
        const orders = await OrderItem.find({ branchId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error: any) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
    }
}

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
        const { orderId, status } = body; 

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
        }

        // Find the order and update its status
        const updatedOrder = await OrderItem.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // Returns the updated document
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        await pusherServer.trigger(`branch-${branchId}`, 'order-status-updated', {
            _id: orderId,
            status
        });
        return NextResponse.json({ 
            success: true, 
            message: `Order marked as ${status}`,
            order: updatedOrder 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
    }
}