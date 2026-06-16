'use client'

import { useEffect } from 'react';
import { useUserAdmin } from '@/context/UserAdminContext';
import { useToast } from '@/context/ToastContext';
import { pusherClient } from '@/utils/pusher/pusherClient';

export default function GlobalOrderListener() {
    const { branch } = useUserAdmin();
    const { showToast } = useToast();

    useEffect(() => {
        if (!branch?._id) return;

        if (!pusherClient) return;

        const channel = pusherClient.subscribe(`branch-${branch._id}`);

        channel.bind('new-order', (incomingOrder: any) => {
            try {
                const audio = new Audio('/ding.mp3');
                audio.play().catch(e => console.log("Audio play blocked until interaction"));
            } catch (error) {
                console.error("Audio error", error);
            }

            showToast(`New order from ${incomingOrder.tableNumber || 'a customer'}!`, "success");
        });

        // We STILL need cleanup here in case the user logs out!
        return () => {
            channel.unbind('new-order');
            pusherClient?.unsubscribe(`branch-${branch._id}`);
        };
    }, [branch?._id]);

    return null;
}