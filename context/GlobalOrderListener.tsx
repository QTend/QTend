'use client'

import { useEffect } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';

// 1. THIS LIVES OUTSIDE THE COMPONENT NOW
// It creates a single, global memory bank for the entire browser tab.
const processedOrders = new Set<string>();

export default function GlobalOrderListener() {
    const { branch } = useUserAdmin();
    const { showToast } = useToast();

    useEffect(() => {
        if (!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

       const handleNewOrder = (incomingOrder: any) => {

            const orderId = incomingOrder._id || incomingOrder.orderNumber || JSON.stringify(incomingOrder);

            if (processedOrders.has(orderId)) {
                console.log("🛑 Blocked duplicate!", orderId);
                return; 
            }

            processedOrders.add(orderId);
            setTimeout(() => processedOrders.delete(orderId), 10000);

            try {
                const audio = new Audio('/ding.mp3');
                audio.play().catch(e => console.log("Audio blocked"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`New order!`, "success");
        };

        channel.bind('new-order', handleNewOrder);

        return () => {
            channel.unbind('new-order', handleNewOrder);
            pusherClient?.unsubscribe(channelName);
        };
    }, [branch?._id, showToast]);

    return null;
}