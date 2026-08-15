'use client'

import { useEffect, useState } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';
import { VolumeX } from 'lucide-react'; // 🚀 NEW IMPORT

const processedAudioEvents = new Set<string>();

export default function GlobalOrderListener() {
    const { branch, hasActiveZones } = useUserAdmin(); 
    const { showToast } = useToast();
    const [audioUnlocked, setAudioUnlocked] = useState(false); // 🚀 NEW STATE

    // 🚀 NEW: The Unlock Function
    const handleUnlockAudio = () => {
        const silentAudio = new Audio('/ding.mp3');
        silentAudio.volume = 0; // Play silently just to unlock the browser engine
        silentAudio.play()
            .then(() => {
                setAudioUnlocked(true);
                showToast("Order sounds enabled!", "success");
            })
            .catch(e => console.error("Could not unlock audio:", e));
    };

    useEffect(() => {
        if (!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

        const handleNewOrder = (incomingOrder: any) => {
            if (hasActiveZones) return; 

            const orderId = `new-${incomingOrder._id || incomingOrder.orderNumber}`;
            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            try {
                const audio = new Audio('/ding.mp3');
                audio.play().catch(e => console.log("Audio blocked - waiting for user unlock"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`New order received!`, "success");
        };

        const handleItemUpdated = (data: any) => {
            if (!data.isOrderFullyReady) return;

            const orderId = `ready-${data.orderId}`; 
            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            try {
                const audio = new Audio('/chime.mp3'); 
                audio.play().catch(e => console.log("Audio blocked - waiting for user unlock"));
            } catch (error) {
                console.error("Audio error");
            }

            showToast(`Order is Ready to Serve!`, "success");
        };

        channel.bind('new-order', handleNewOrder);
        channel.bind('item-updated', handleItemUpdated);

        return () => {
            channel.unbind('new-order', handleNewOrder);
            channel.unbind('item-updated', handleItemUpdated);
        };
    }, [branch?._id, hasActiveZones, showToast]); 

    // 🚀 NEW: Show a floating button until the user clicks it once
    if (!audioUnlocked) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={handleUnlockAudio}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full shadow-lg font-bold transition-all animate-bounce"
                >
                    <VolumeX size={20} />
                    Enable Order Sounds
                </button>
            </div>
        );
    }

    return null;
}