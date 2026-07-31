import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { connectToDB } from '@/utils/connectToDb';
import Order from '@/utils/models/OrderItem';
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

        // 1. Get the timeframe from the URL query params
        const { searchParams } = new URL(req.url);
        const timeframe = searchParams.get('timeframe') || 'today';

        // 2. Calculate the date threshold
        const now = new Date();
        let dateThreshold = new Date();

        if (timeframe === 'today') {
            // Set to 12:00 AM this morning
            dateThreshold.setHours(0, 0, 0, 0); 
        } else if (timeframe === '7days') {
            dateThreshold.setDate(now.getDate() - 7);
        } else if (timeframe === '14days') {
            dateThreshold.setDate(now.getDate() - 14);
        } else if (timeframe === '30days') {
            dateThreshold.setDate(now.getDate() - 30);
        }

        // 3. Query MongoDB using $gte (Greater Than or Equal to)
        const orders = await Order.find({ 
            branchId,
            createdAt: { $gte: dateThreshold } 
        })
        .populate('items.zoneId', 'name')
        .sort({ createdAt: -1 });

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
        // 1. Extract both potential statuses from the request body
        const { orderId, status, paymentStatus } = body; 

        // 2. Validate that we have an ID, and AT LEAST ONE of the statuses to update
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }
        if (!status && !paymentStatus) {
            return NextResponse.json({ error: 'Missing status or paymentStatus to update' }, { status: 400 });
        }

        // 3. Dynamically build the update object based on what the frontend sent
        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        // 4. Update using the main Order model (🚀 FIX: Changed OrderItem to Order)
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData, // Pass the dynamic object here
            { new: true } 
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 5. Trigger the pusher event so all connected screens update instantly
        await pusherServer.trigger(`branch-${branchId}`, 'order-status-updated', {
            _id: orderId,
            ...updateData // Send whatever actually changed to the frontend
        });

        return NextResponse.json({ 
            success: true, 
            message: `Order updated successfully`,
            order: updatedOrder 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
    }
}