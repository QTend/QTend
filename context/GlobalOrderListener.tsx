'use client'

import { useEffect } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';

// 🚀 A single global memory bank using prefixes ('new-' and 'ready-') 
// to prevent double-chimes without collisions.
const processedAudioEvents = new Set<string>();

export default function GlobalOrderListener() {
    const { branch, hasActiveZones } = useUserAdmin(); 
    const { showToast } = useToast();

    useEffect(() => {
        if (!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

        // ==========================================
        // 1. NEW ORDER LISTENER
        // ==========================================
        const handleNewOrder = (incomingOrder: any) => {
            console.log('sound 2', hasActiveZones)
            // 🚀 SMART FILTER: If they have zones, stay quiet! The KDS iPad will ding instead.
            if (hasActiveZones) return; 

            const orderId = `new-${incomingOrder._id || incomingOrder.orderNumber}`;

            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            try {
                // Classic ding for new orders
                const audio = new Audio('/ding.mp3');
                audio.play().catch(e => console.log("Audio blocked by browser"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`New order received!`, "success");
        };

        // ==========================================
        // 2. KITCHEN "READY" LISTENER
        // ==========================================
        const handleItemUpdated = (data: any) => {
            // 🚀 SMART FILTER: Only chime if the entire ticket is ready
            if (!data.isOrderFullyReady) return;
            console.log('sound', hasActiveZones)

            const orderId = `ready-${data.orderId}`; 

            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            try {
                // Front-of-House polite chime
                const audio = new Audio('/chime.mp3'); 
                audio.play().catch(e => console.log("Audio blocked by browser"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`Order is Ready to Serve!`, "success");
        };

        // Bind BOTH listeners
        channel.bind('new-order', handleNewOrder);
        channel.bind('item-updated', handleItemUpdated);

        return () => {
            // Clean up both listeners
            channel.unbind('new-order', handleNewOrder);
            channel.unbind('item-updated', handleItemUpdated);
            // We do NOT unsubscribe the channel here, so the Orders page stays connected!
        };
    }, [branch?._id, hasActiveZones, showToast]); 

    return null;
}