'use client'

import { pusherClient } from "@/utils/pusher/pusherClient"
import { useEffect, useState, useRef } from "react"
import { Bell } from "lucide-react"

interface NotificationCompProps {
    branchId: string;
    isOpen: boolean;
    setIsOpen: any;
}

const NotificationComp = ({ branchId, isOpen, setIsOpen }: NotificationCompProps) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/user-admin/${branchId}/notifications`);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch Notifications', error);
        }
    }

    useEffect(() => {
        if (!branchId) return;

        fetchNotifications();

        if (!pusherClient) return;

        const channelName = `branch-${branchId}`;
        const channel = pusherClient.subscribe(channelName);

        const handleNewNotifications = (incomingNotification: any) => {
            setNotifications(prev => [incomingNotification, ...prev]);
        }

        channel.bind('new-notification', handleNewNotifications);

        return () => {
            channel.unbind('new-notification', handleNewNotifications);
            pusherClient?.unsubscribe(channelName);
        }
    }, [branchId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return '';
        const diffInMinutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    }

    // NEW: Mark a single notification as read
    const markAsRead = async (notificationId: string, currentIsRead: boolean) => {
        // If it's already read, don't waste a database call!
        if (currentIsRead) return;

        // 1. Optimistic UI Update (Instantly turn it white for the user)
        setNotifications(prev => 
            prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );

        // 2. Background Database Update
        try {
            await fetch(`/api/user-admin/${branchId}/notifications`, { 
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId }) 
            });
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    }

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        
        try {
            await fetch(`/api/user-admin/${branchId}/notifications`, { 
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true }) 
            });
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            
            <div 
                className="relative cursor-pointer p-2 rounded-full bg-[#F2F2F2] w-12 h-12 flex justify-center items-center hover:bg-gray-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={24} className="text-[#333333]" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center bg-[#F04438] text-white text-[10px] font-bold w-5 h-5 rounded-full border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 top-12 bg-white w-[350px] md:w-[400px] rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className='text-[#333333] font-medium flex justify-between items-center px-4 py-4'>
                        <p className='text-[#333333] font-bold text-lg flex items-center gap-2'>
                            Notifications 
                            {unreadCount > 0 && (
                                <span className='bg-[#F04438] px-2.5 py-0.5 rounded-full text-white text-xs'>
                                    {unreadCount} new
                                </span>
                            )}
                        </p>
                        {unreadCount > 0 && (
                            <p 
                                onClick={markAllAsRead}
                                className='text-[#68A544] text-sm font-medium cursor-pointer hover:underline'
                            >
                                Mark all as read
                            </p>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif._id}
                                    // NEW: Attached the function to the onClick event
                                    onClick={() => markAsRead(notif._id, notif.isRead)}
                                    className={`px-4 py-4 flex flex-col gap-1 border-t border-gray-100 transition-colors cursor-pointer ${
                                        notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-[#EAECF0] hover:bg-[#E0E2E6]'
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <span className='text-[#333333] text-sm font-medium leading-snug'>
                                            {notif.message}
                                        </span>
                                        <span className='text-[#666666] text-xs whitespace-nowrap shrink-0 mt-0.5'>
                                            {getTimeAgo(notif.createdAt)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                        {notif.title}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            )}
        </div>
    )
}

export default NotificationComp;