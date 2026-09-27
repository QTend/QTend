'use client'

import { useEffect, useState, useRef } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';
import { VolumeX } from 'lucide-react';

const processedAudioEvents = new Set<string>();

export default function GlobalOrderListener() {
    const { branch, hasActiveZones } = useUserAdmin(); 
    const { showToast } = useToast();
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    
    const isProPlan = branch?.plans?.planType === 'pro';

    // 1. Strict references to the audio files
    const dingAudio = useRef<HTMLAudioElement | null>(null);
    const chimeAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        dingAudio.current = new Audio('/ding.mp3');
        chimeAudio.current = new Audio('/chime.mp3');
    }, []);

    // 2. Unlock THESE SPECIFIC instances on user click
    const handleUnlockAudio = () => {
        if (!dingAudio.current || !chimeAudio.current) return;

        dingAudio.current.volume = 0;
        chimeAudio.current.volume = 0;

        Promise.all([
            dingAudio.current.play().catch(e => console.log("Ding unlock failed", e)),
            chimeAudio.current.play().catch(e => console.log("Chime unlock failed", e))
        ]).then(() => {
            dingAudio.current!.pause();
            dingAudio.current!.currentTime = 0;
            dingAudio.current!.volume = 1;

            chimeAudio.current!.pause();
            chimeAudio.current!.currentTime = 0;
            chimeAudio.current!.volume = 1;

            setAudioUnlocked(true);
            showToast("Order sounds enabled!", "success");
        });
    };

    useEffect(() => {
        if (!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

        const handleNewOrder = (incomingOrder: any) => {
            // 🚀 THE FIX: Only mute the dashboard if they are ACTUALLY using the KDS on the Pro plan
            if (hasActiveZones && isProPlan) return; 

            const orderId = `new-${incomingOrder._id || incomingOrder.orderNumber}`;
            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            if (dingAudio.current) {
                dingAudio.current.currentTime = 0; 
                dingAudio.current.play().catch(e => console.log("Audio blocked", e));
            }

            showToast(`New order received!`, "success");
        };

        const handleItemUpdated = (data: any) => {
            if (!data.isOrderFullyReady) return;

            const orderId = `ready-${data.orderId}`; 
            if (processedAudioEvents.has(orderId)) return;
            
            processedAudioEvents.add(orderId);
            setTimeout(() => processedAudioEvents.delete(orderId), 10000);

            if (chimeAudio.current) {
                chimeAudio.current.currentTime = 0;
                chimeAudio.current.play().catch(e => console.log("Audio blocked", e));
            }

            showToast(`Order is Ready to Serve!`, "success");
        };

        channel.bind('new-order', handleNewOrder);
        channel.bind('item-updated', handleItemUpdated);

        return () => {
            channel.unbind('new-order', handleNewOrder);
            channel.unbind('item-updated', handleItemUpdated);
            pusherClient?.unsubscribe(channelName);
        };
    }, [branch?._id, hasActiveZones, isProPlan, showToast]); 

    if (!audioUnlocked) {
        return (
            <div className="fixed bottom-25 md:bottom-6 right-6 z-50">
                <button 
                    onClick={handleUnlockAudio}
                    className="flex items-center gap-2 bg-[#F04438] hover:bg-[#D92D20] text-white px-5 py-3 rounded-full shadow-lg font-bold transition-all animate-bounce"
                >
                    <VolumeX size={20} />
                    Enable Order Sounds
                </button>
            </div>
        );
    }

    return null;
}