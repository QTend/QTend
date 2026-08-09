'use client'

import { useEffect } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';

// 🚀 Memory bank specifically for "Ready" orders to prevent double-chimes
const processedReadyOrders = new Set<string>();

export default function GlobalOrderListener() {
    const { branch } = useUserAdmin();
    const { showToast } = useToast();

    useEffect(() => {
        if (!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

        // 🚀 UPDATED: Now we listen for item updates, not new orders
        const handleItemUpdated = (data: any) => {
            // Smart Filter: ONLY ring the bell if the entire ticket is ready!
            if (!data.isOrderFullyReady) return;

            const orderId = data.orderId;

            if (processedReadyOrders.has(orderId)) {
                return; // Block duplicate events
            }

            processedReadyOrders.add(orderId);
            setTimeout(() => processedReadyOrders.delete(orderId), 10000);

            try {
                // Front-of-House polite chime
                const audio = new Audio('/chime.mp3'); 
                audio.play().catch(e => console.log("Audio blocked by browser"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`Order is Ready to Serve!`, "success");
        };

        channel.bind('item-updated', handleItemUpdated);

        return () => {
            channel.unbind('item-updated', handleItemUpdated);
            // NOTE: We removed pusherClient.unsubscribe(channelName) here! 
            // The Admin Orders component is using this same channel, so we don't want to kill it.
        };
    }, [branch?._id, showToast]);

    return null;
}