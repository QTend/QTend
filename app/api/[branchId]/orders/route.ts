import { connectToDB } from '@/utils/connectToDb';
import Branches from '@/utils/models/Branches';
import Order from '@/utils/models/OrderItem';
import { pusherServer } from '@/utils/pusher/pusher';
import { dispatchPushAlert } from '@/utils/pushNotification';
import { NextResponse } from 'next/server';

// 🚀 Explicitly type incoming cart items to prevent implicit 'any' warnings
interface CartItemInput {
    _id?: string;
    zoneId?: string;
    name?: string;
    quantity?: number;
    price?: number;
}

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    try {
        // 1. Connect to the database
        await connectToDB();

        // 2. Unwrap dynamic params (Next.js 15 requirement)
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        // 3. Parse incoming cart data
        const body = await req.json();
        const { tableNumber, items, totalAmount, specialInstructions } = body;

        // Basic validation
        if (!branchId || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields or empty cart' }, { status: 400 });
        }

        // Retrieve the branch slug
        const branch = await Branches.findById(branchId)
            .select('slug plans')
            .lean();

        if (!branch || !branch.slug) {
            return NextResponse.json(
                { error: 'Branch or branch slug not found' },
                { status: 404 }
            );
        }
        
        const isProPlan = branch.plans?.planType === 'pro';
        const branchSlug = branch.slug;

        // 🚀 Type-safe extraction of unique zone IDs
        const rawZoneIds: string[] = (items as CartItemInput[])
            .map((item) => item.zoneId)
            .filter((id): id is string => typeof id === 'string' && id.trim().length > 0);

        const uniqueZoneIds: string[] = Array.from(new Set<string>(rawZoneIds));

        // 4. Generate clean Order Number (e.g., "ORD-83492")
        const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        // 5. Create and save the order to MongoDB
        const newOrder = await Order.create({
            branchId,
            orderNumber,
            tableNumber: tableNumber || 'Remote',
            items,
            totalAmount,
            specialInstructions,
            status: 'Active',
            paymentStatus: 'Unpaid'
        });

        const populatedOrder = await Order.findById(newOrder._id).populate('items.zoneId', 'name');

        // 6. Real-time websocket update for screens that are awake
        await pusherServer.trigger(`branch-${branchId}`, 'new-order', populatedOrder);

        // 7. 3. Dispatch based on Plan + Order Contents
        if (isProPlan && uniqueZoneIds.length > 0) {
            /// 🟢 PRO PLAN + HAS ZONES: Route to specific kitchen screens
            await dispatchPushAlert({
                branchId,
                target: 'zones',
                zoneIds: uniqueZoneIds,
                title: '🚨 NEW TICKET',
                body: `Order #${newOrder.orderNumber} for Table ${newOrder.tableNumber}`,
                url: `/kds/${branchSlug}/zone`,
            });
        } else {
            // 🟡 BASIC/STARTER (or Pro order with unassigned items): Route to Admin
            await dispatchPushAlert({
                branchId,
                target: 'admin',
                title: '🚨 NEW ORDER',
                body: `Order #${newOrder.orderNumber} for Table ${newOrder.tableNumber}`,
                url: `/dashboard/${branchSlug}/orders`,
            });
        }

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