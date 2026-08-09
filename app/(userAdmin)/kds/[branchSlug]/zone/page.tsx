'use client'

import { pusherClient } from "@/utils/pusher/pusherClient";
// 🚀 NEW: Added AlertTriangle for the expired link screen
import { SlidersVertical, CheckCircle, ChevronDown, Lock, AlertTriangle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation"; 

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

const processedKDSOrders = new Set<string>();

export default function ZoneOrders() {
    const params = useParams();
    const branchSlug = params?.branchSlug as string; 
    
    const searchParams = useSearchParams();
    const targetZone = searchParams.get('zone')?.toLowerCase() || '';
    const rawToken = searchParams.get('token');
    const token = (rawToken && rawToken !== 'undefined' && rawToken !== 'null') ? rawToken : '';

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemLoading, setItemLoading] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'Active' | 'Completed'>('Active'); 
    const [timeframe, setTimeframe] = useState('today');
    const [realBranchId, setRealBranchId] = useState<string | null>(null);
    const [isTokenInvalid, setIsTokenInvalid] = useState(false);

    const filters = ['Active', 'Completed'];

    useEffect(() => {
        if(!realBranchId || !pusherClient || !token) return;

        const channelName = `branch-${realBranchId}`;
        const channel = pusherClient.subscribe(channelName);

        const handleNewOrder = (incomingOrder: any) =>  {
            console.log('🔥 NEW ORDER RECEIVED VIA PUSHER:', incomingOrder);
            setOrders(prevOrder => [incomingOrder, ...prevOrder]);

            // 🚀 NEW: Smart Filter for the Kitchen Bell
            const orderId = incomingOrder._id || incomingOrder.orderNumber;
            
            // 1. Block duplicate sounds
            if (processedKDSOrders.has(orderId)) return;
            processedKDSOrders.add(orderId);
            setTimeout(() => processedKDSOrders.delete(orderId), 10000);

            // 2. Check if this specific zone has to cook anything for this order
            const hasItemsForThisZone = incomingOrder.items.some((item: any) => {
                const zName = typeof item.zoneId === 'object' ? item.zoneId?.name?.toLowerCase() : '';
                return zName === targetZone;
            });

            // 3. Only play the sound if the order belongs to them
            if (hasItemsForThisZone) {
                try {
                    const audio = new Audio('/ding.mp3'); 
                    audio.play().catch(e => console.log("KDS Audio Blocked - Tap the screen first!"));
                } catch (error) {
                    console.error("Audio error");
                }
            }
        };

        channel.bind('new-order', handleNewOrder);

        return () => {
            channel.unbind('new-order', handleNewOrder);
        }
    }, [realBranchId, token]);

    const fetchOrders = useCallback(async (showLoadingState = false) => {
        if (showLoadingState) setIsLoading(true);
        try {
            const res = await fetch(`/api/user-admin/kds/orders?timeframe=${timeframe}&token=${token}`);
            const data = await res.json();
            
            if (res.ok) {
                setOrders(data.orders);
                setRealBranchId(data.branchId);
            } else {
                // 🚀 NEW: Catch the exact 401 error and trigger the expired UI
                if (res.status === 401) {
                    setIsTokenInvalid(true);
                }
                console.error("API Error:", data.error);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (showLoadingState) setIsLoading(false);
        }
    }, [timeframe, token]); 

    useEffect(() => {
        if (branchSlug && token) {
            fetchOrders(true); 
        }
    }, [fetchOrders, branchSlug, token]); 

    const markItemReady = async (orderId: string, itemId: string) => {
        setItemLoading(itemId);

        try {
            const res = await fetch(`/api/user-admin/kds/orders/items?token=${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, itemId, itemStatus: 'Ready' })
            });

            if (!res.ok) throw new Error("Failed to update item status");

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

    // ==========================================
    // 🚀 Missing Token UI
    // ==========================================
    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={36} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        This Kitchen Display screen is missing its secure access token. Please ask your manager to generate and share the correct <span className="font-semibold text-slate-700">KDS Magic Link</span> from the admin dashboard.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // 🚀 NEW: Expired/Invalid Token UI
    // ==========================================
    if (isTokenInvalid) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={36} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Link Expired</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        The security token for this link is invalid or has been reset by the manager. Please request a new Magic Link to access this station.
                    </p>
                </div>
            </div>
        );
    }
    // ==========================================

    const filteredOrders = orders.filter(order => {
        if (order.status !== activeFilter) return false;
        
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