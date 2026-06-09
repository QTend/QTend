import { connectToDB } from '@/utils/connectToDb';
import OrderItem from '@/utils/models/OrderItem';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    try {
        // 1. Connect to the database
        await connectToDB();

        // 2. Unwrap the dynamic params from the URL to get the branchId (Next.js 15 requirement)
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        // 3. Parse the incoming data from the customer's cart
        const body = await req.json();
        const { tableNumber, items, totalAmount, specialInstructions } = body;

        // Basic validation (Now checking the URL's branchId and the body's contents)
        if (!branchId || !tableNumber || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields or empty cart' }, { status: 400 });
        }

        // 4. Generate a clean Order Number (e.g., "ORD-83492")
        const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        // 5. Create and save the order to MongoDB
        const newOrder = await OrderItem.create({
            branchId,
            orderNumber,
            tableNumber,
            items,
            totalAmount,
            specialInstructions,
            status: 'Active'
        });

        // 6. Send success response back to the phone
        return NextResponse.json({ 
            success: true, 
            message: 'Order placed successfully',
            order: newOrder 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
    }
}