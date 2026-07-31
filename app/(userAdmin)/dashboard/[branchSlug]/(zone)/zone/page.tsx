'use client'

import { useUserAdmin } from "@/context/UserAdminContext";
import { pusherClient } from "@/utils/pusher/pusherClient";
import { SlidersVertical, CheckCircle, ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    itemStatus: 'Pending' | 'Preparing' | 'Ready';
    zoneId?: { _id: string, name: string } | string; 
}

interface Order {
    _id: string;          
    orderNumber: string;  
    tableNumber: string;
    status: 'Active' | 'Completed';
    items: OrderItem[];
    createdAt: string;
    specialInstructions?: string;
}

export default function ZoneOrders() {
    const { branch } = useUserAdmin();
    const branchId = branch?._id;
    
    // 🚀 NEW: Get the zone name from the URL (e.g., ?zone=bar)
    const searchParams = useSearchParams();
    const targetZone = searchParams.get('zone')?.toLowerCase() || '';

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemLoading, setItemLoading] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'Active' | 'Completed'>('Active'); 
    const [timeframe, setTimeframe] = useState('today');

    const filters = ['Active', 'Completed'];

    useEffect(() => {
        if(!branch?._id || !pusherClient) return;

        const channelName = `branch-${branch._id}`;
        const channel = pusherClient.subscribe(channelName);

        const handleNewOrder = (incomingOrder: any) =>  {
            console.log('🔥 NEW ORDER RECEIVED VIA PUSHER:', incomingOrder);
            setOrders(prevOrder => [incomingOrder, ...prevOrder]);
        };

        channel.bind('new-order', handleNewOrder);

        return () => {
            channel.unbind('new-order', handleNewOrder);
        }
    }, [branch?._id]);

    const fetchOrders = useCallback(async (showLoadingState = false) => {
        if (showLoadingState) setIsLoading(true);
        try {
            const res = await fetch(`/api/user-admin/${branchId}/orders?timeframe=${timeframe}`);
            const data = await res.json();
            
            if (res.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (showLoadingState) setIsLoading(false);
        }
    }, [branchId, timeframe]); 

    useEffect(() => {
        fetchOrders(true); 
    }, [fetchOrders]); 

    // 🚀 NEW: Marks a specific item as "Ready" instead of the whole order
    const markItemReady = async (orderId: string, itemId: string) => {
        setItemLoading(itemId);

        try {
            const res = await fetch(`/api/user-admin/${branchId}/orders/items`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, itemId, itemStatus: 'Ready' })
            });

            if (!res.ok) throw new Error("Failed to update item status");

            // Update local state instantly for a snappy UI
            setOrders(prev => prev.map(order => {
                if (order._id !== orderId) return order;
                return {
                    ...order,
                    items: order.items.map(item => 
                        item._id === itemId ? { ...item, itemStatus: 'Ready' } : item
                    )
                };
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to update item. Reverting.");
        } finally {
            setItemLoading(null);
        }
    }

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return '';
        const diffInMinutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    // 🚀 NEW: Deep filtering to isolate ONLY this zone's tickets
    const filteredOrders = orders.filter(order => {
        // 1. Match Active/Completed status
        if (order.status !== activeFilter) return false;
        
        // 2. Check if this order has ANY items belonging to this specific zone
        const hasItemsForThisZone = order.items.some(item => {
            const zoneName = typeof item.zoneId === 'object' ? item.zoneId?.name?.toLowerCase() : '';
            return zoneName === targetZone;
        });

        return hasItemsForThisZone;
    });

    return  (
        <div className="mx-auto md:p-6">
            {/* Header Area */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#4B2E05] capitalize mb-4">
                    {targetZone ? `${targetZone} Station` : 'Prep Station'}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="bg-white p-1.5 flex items-center gap-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
                        {filters.map(f => (
                            <button 
                                key={f} 
                                onClick={() => setActiveFilter(f as any)}
                                className={`text-sm rounded-xl py-2 px-4 transition-colors font-medium ${
                                    activeFilter === f 
                                    ? 'bg-[#F97316] text-white shadow-sm' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center bg-white py-2 pl-3 pr-8 gap-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors w-fit">
                        <SlidersVertical size={16} className="text-gray-500" />
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none appearance-none cursor-pointer w-full z-10 relative"
                        >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                        </select>
                        <ChevronDown size={16} className="text-gray-500 absolute right-3 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Grid layout for responsive kitchen tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#F97316] rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-500 font-medium">Loading {targetZone} tickets...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500 font-medium text-lg">No {activeFilter.toLowerCase()} orders for {targetZone}.</p>
                        {activeFilter === 'Active' && <p className="text-sm text-gray-400 mt-1">Waiting for new tickets...</p>}
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        // Isolate only the items meant for this screen
                        const zoneItems = order.items.filter(item => {
                            const zName = typeof item.zoneId === 'object' ? item.zoneId?.name?.toLowerCase() : '';
                            return zName === targetZone;
                        });

                        return (
                            <div key={order._id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col h-full">
                                {/* Ticket Header */}
                                <div className="flex items-start justify-between border-b border-gray-100 pb-3 mb-3">
                                    <div className="grid gap-1">
                                        <p className="text-xl font-black text-[#F97316]">#{order.orderNumber}</p>
                                        <p className="text-[#333333] font-bold text-lg">{order.tableNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-500">{getTimeAgo(order.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {order.specialInstructions && (
                                    <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl">
                                        <p className="text-xs text-orange-400 font-bold uppercase mb-1">Note:</p>
                                        <p className="text-orange-800 text-sm font-medium">{order.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Ticket Items */}
                                <div className="flex-1 flex flex-col gap-3">
                                    {zoneItems.map((item, index) => (
                                        <div key={item._id || index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="font-bold text-[#333333] text-lg leading-tight">
                                                <span className="text-gray-400 mr-2">{item.quantity}x</span>
                                                {item.name}
                                            </p>
                                            
                                            {/* Item Action Button */}
                                            {item.itemStatus !== 'Ready' ? (
                                                <button 
                                                    onClick={() => markItemReady(order._id, item._id)}
                                                    disabled={itemLoading === item._id}
                                                    className="mt-1 w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-lg py-2 px-4 transition-colors active:scale-95 disabled:opacity-50"
                                                >
                                                    {itemLoading === item._id ? "Updating..." : "Mark Ready"}
                                                </button>
                                            ) : (
                                                <div className="mt-1 flex items-center justify-center gap-1.5 w-full bg-green-100 text-green-700 font-bold rounded-lg py-2 px-4">
                                                    <CheckCircle size={18} /> Ready
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
