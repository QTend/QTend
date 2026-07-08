import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Notification from "@/utils/models/Notification";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET ( req : NextRequest, {params}: {params: Promise<{branchId: string}>}) {

    const session: any = await getServerSession(authOptions)
    if(!session?.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        await connectToDB();
        const {branchId} = await params

        if(!branchId){
            return NextResponse.json({ error: "Branch ID parameter missing" }, { status: 400 });
        }

        const notifications = await Notification.find({branchId}).sort({createdAt: -1}).limit(50);


        return NextResponse.json({
            success: true,
            notifications
        })

    } catch (error: any) {
        console.error('Error fetching Notification', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ branchId: string }> }) {

    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDB();
        
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        if (!branchId) {
            return NextResponse.json({ error: "Branch ID parameter missing" }, { status: 400 });
        }

    
        const body = await req.json();
        const { notificationId, markAll } = body;

        // SCENARIO A: Mark EVERYTHING as read for this branch
        if (markAll) {
            // updateMany targets all unread notifications for this specific branch
            const result = await Notification.updateMany(
                { branchId, isRead: false }, 
                { $set: { isRead: true } }
            );

            return NextResponse.json({ 
                success: true, 
                message: `Marked ${result.modifiedCount} notifications as read.` 
            }, { status: 200 });
        }

        // SCENARIO B: Mark a SINGLE notification as read
        if (notificationId) {
            const updatedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                { $set: { isRead: true } },
                { new: true } // Returns the updated document
            );

            if (!updatedNotification) {
                return NextResponse.json({ error: "Notification not found" }, { status: 404 });
            }

            return NextResponse.json({ 
                success: true, 
                notification: updatedNotification 
            }, { status: 200 });
        }

        // If the frontend sends an empty payload by mistake
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });

    } catch (error: any) {
        console.error('Error updating Notification:', error);
        return NextResponse.json({ error: error.message || 'Failed to update notification' }, { status: 500 });
    }
}
