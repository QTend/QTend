import { connectToDB } from '@/utils/connectToDb';
import WaiterRequest from '@/utils/models/WaiterRequest';
import { pusherServer } from '@/utils/pusher/pusher';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    try {
        await connectToDB();

        // Unwrap dynamic params (Next.js 15 requirement)
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        // Parse the body sent from CallWaiterModal
        const body = await req.json();
        const { tableNumber, requestType } = body;

        // 1. Validate the input
        if (!branchId || !tableNumber || !requestType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Prevent spam (Optional but highly recommended)
        // Check if this table already has an identical pending request to prevent them mashing the button
        const existingRequest = await WaiterRequest.findOne({
            branchId,
            tableNumber,
            requestType,
            status: 'Pending'
        });

        if (existingRequest) {
             return NextResponse.json({ 
                 success: true, 
                 message: 'We already received this request and are on our way!' 
             }, { status: 200 }); // Still return 200 so the frontend modal closes smoothly
        }

        // 3. Create the request in the database
        const newRequest = await WaiterRequest.create({
            branchId,
            tableNumber,
            requestType,
            status: 'Pending'
        });

        // 4. Fire the real-time Pusher event to the Admin Dashboard
        // Notice this matches the exact channel and event name we put in WaiterNotification.tsx
        await pusherServer.trigger(`branch-${branchId}`, 'waiter-called', {
            _id: newRequest._id,
            tableNumber: newRequest.tableNumber,
            requestType: newRequest.requestType,
            status: newRequest.status
        });

        // 5. Respond back to the customer's phone
        return NextResponse.json({ 
            success: true, 
            message: 'Waiter has been notified',
            request: newRequest
        }, { status: 201 });

    } catch (error: any) {
        console.error("Waiter Request Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to call waiter' }, { status: 500 });
    }
}