import { connectToDB } from "@/utils/connectToDb"
import Notification from "@/utils/models/Notification";
import { pusherServer } from "@/utils/pusher/pusher";

interface NotificationProps {
    branchId: string;
    title: string;
    message: string;
    type: 'Waiter_Call' | 'Order_Completed'| 'System_Alert';
    referenceId?: string;
}

export const createNotification = async ({
    branchId,
    title,
    message,
    type,
    referenceId,
}: NotificationProps) => {

    try {
        await connectToDB();

       const newNotification =  await Notification.create({
            branchId,
            title,
            message,
            type,
            referenceId
        })

        await pusherServer.trigger(`branch-${branchId}`, 'new-notification', newNotification )

        return { success: true, notification: newNotification };
        
    } catch (error) {
        console.log('Notification Helper Error', error)
    }
}