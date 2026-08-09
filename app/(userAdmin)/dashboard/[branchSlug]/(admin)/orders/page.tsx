'use client'

import { useUserAdmin } from "@/context/UserAdminContext";
import { pusherClient } from "@/utils/pusher/pusherClient";
import { ChevronDown, ChevronUp, SlidersVertical, CheckCircle, Clock } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    itemStatus: 'Pending' | 'Ready'; // 🚀 Added itemStatus
    zoneId?: { _id: string, name: string } | string;
}

interface Order {
    _id: string;          
    orderNumber: string;  
    tableNumber: string;
    totalAmount: number;
    status: 'Active' | 'Completed';
    items: OrderItem[];
    createdAt: string;
    specialInstructions?: string;
    paymentStatus: 'Paid' | 'Unpaid';
}

export default function KitchenOrders() {
    const { branch } = useUserAdmin()
    const branchId = branch?._id;

    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [completeLoading, setCompleteLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState<'All Orders' | 'Active' | 'Completed'>('Active') 
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]) 
    const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
    const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
    
    const [timeframe, setTimeframe] = useState('today');

    const filters = ['All Orders', 'Active', 'Completed']

    useEffect(() => {
        if(!branchId || !pusherClient) return;

        const channelName = `branch-${branchId}`;
        const channel = pusherClient.subscribe(channelName);

        console.log("Admin listening to channel:", channelName)

        const handleNewOrder = (incomingOrder: any) =>  {
            console.log('🔥 NEW ORDER RECEIVED VIA PUSHER ORDER PAGE:', incomingOrder);
            setOrders((prevOrder => [incomingOrder, ...prevOrder]))
        };

        // 🚀 NEW: Listener for Kitchen Updates
        const handleItemUpdated = (data: any) => {
            console.log(`🛎️ Kitchen update: Item is now ${data.itemStatus}`);
            
            setOrders(prevOrders => prevOrders.map(order => {
                if (order._id !== data.orderId) return order;
                
                // Update the specific item's status
                const updatedItems = order.items.map(item => 
                    item._id === data.itemId 
                        ? { ...item, itemStatus: data.itemStatus } 
                        : item
                );
                
                return { ...order, items: updatedItems };
            }));
        };

        channel.bind('new-order', handleNewOrder);
        channel.bind('item-updated', handleItemUpdated); // 🚀 Bind the new event

        return () => {
            channel.unbind('new-order', handleNewOrder);
            channel.unbind('item-updated', handleItemUpdated); // Clean it up
        }
    }, [branchId]);

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

    const markOrderComplete = async (orderId: string, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setCompleteLoading(true)

        try {
            const res = await fetch(`/api/user-admin/${branchId}/orders`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId, status: 'Completed' })
            });

            if (!res.ok) throw new Error("Failed to update status");

            setOrders(prev => prev.map(order => 
            order._id === orderId ? { ...order, status: 'Completed' } : order
        ));
            
        } catch (error) {
            console.error(error);
            alert("Failed to update order. Reverting.");
        } finally {
            setCompleteLoading(false);
        }
    }

    const markOrderPaid = async (orderId: string, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setPaymentLoading(orderId);

        try {
            const res = await fetch(`/api/user-admin/${branchId}/orders`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId, paymentStatus: 'Paid' })
            });

            if (!res.ok) throw new Error("Failed to update payment status");

            setOrders(prev => prev.map(order => 
                order._id === orderId ? { ...order, paymentStatus: 'Paid' } : order
            ));
        } catch (error) {
            console.error(error);
            alert("Failed to update payment. Reverting.");
        } finally {
            setPaymentLoading(null);
        }
    }

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId) 
                : [...prev, orderId] 
        )
    }

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return '';
        const diffInMinutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = activeFilter === 'All Orders' || order.status === activeFilter;
        const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
        return matchesStatus && matchesPayment;
    });

    return  (
        <div className="mx-auto  md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                
                <div className="bg-white p-1.5 flex items-center gap-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
                    {filters.map(f => (
                        <button 
                            key={f} 
                            onClick={() => setActiveFilter(f as any)}
                            className={`text-sm rounded-xl py-2 px-4 transition-colors font-medium ${
                                activeFilter === f 
                                ? 'bg-[#68A544] text-white shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex items-center bg-white py-2 pl-3 pr-8 gap-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <SlidersVertical size={16} className="text-gray-500" />
                        
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none appearance-none cursor-pointer w-full z-10 relative"
                        >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="14days">Last 14 Days</option>
                            <option value="30days">Last 30 Days</option>
                        </select>

                        <ChevronDown size={16} className="text-gray-500 absolute right-3 pointer-events-none" />
                    </div>

                    <div className="relative flex items-center bg-white py-2 pl-3 pr-8 gap-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <select 
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value as any)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none appearance-none cursor-pointer w-full z-10 relative"
                        >
                            <option value="All">All Payments</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                        <ChevronDown size={16} className="text-gray-500 absolute right-3 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#68A544] rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-500 font-medium">Loading kitchen tickets...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500 font-medium text-lg">No {activeFilter.toLowerCase()} found.</p>
                        {activeFilter === 'Active' && <p className="text-sm text-gray-400 mt-1">Waiting for new orders...</p>}
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const isExpanded = expandedOrders.includes(order._id);
                        const isActive = order.status === 'Active';
                        
                        // 🚀 NEW: Determine if EVERY item in the order is 'Ready'
                        const isFullyReady = order.items.length > 0 && order.items.every(item => item.itemStatus === 'Ready');

                        return (
                            <div 
                                key={order._id} 
                                // 🚀 NEW: If it's fully ready and still active, give the whole card a green glowing border!
                                className={`bg-white rounded-2xl p-4 md:p-5 transition-all shadow-sm border ${
                                    isActive && isFullyReady ? 'border-green-400 shadow-green-100' : 
                                    isExpanded ? 'border-blue-200' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div 
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid gap-1">
                                            <p className="text-[#333333] font-bold text-lg">{order.tableNumber}</p>
                                            <p className="text-sm text-[#F97316] font-medium">{getTimeAgo(order.createdAt)}</p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {/* 🚀 NEW: Ticket Status Badge swaps to 'Ready to Serve' when food is done */}
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                                !isActive ? 'bg-gray-50 text-gray-600 border-gray-200' : 
                                                isFullyReady ? 'bg-green-500 text-white border-green-600 animate-pulse' : 
                                                'bg-blue-50 text-blue-600 border-blue-200'
                                            }`}>
                                                {!isActive ? 'Completed' : isFullyReady ? <><CheckCircle size={14}/> Ready to Serve</> : 'Active'}
                                            </div>

                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                                order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                                            }`}>
                                                {order.paymentStatus || 'Unpaid'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-gray-100 transition-colors text-gray-500">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="mt-5 pt-5 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[#333333]">
                                                <span className="text-xl font-bold ml-1 text-[#F97316]">#{order.orderNumber}</span>
                                            </p>
                                        </div>

                                        {order.specialInstructions && (
                                            <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl">
                                                <p className="text-xs text-orange-400 font-bold uppercase mb-1">Special Instructions:</p>
                                                <p className="text-orange-800 text-sm font-medium">{order.specialInstructions}</p>
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <p className="text-[#666666] text-sm mb-2">Items:</p>
                                            <div className="flex flex-col gap-3">
                                                {order.items.map((item, index) => {
                                                    const zoneName = typeof item.zoneId === 'object' ? item.zoneId?.name : null;
                                                    
                                                    return (
                                                        <div key={item._id || index} className="flex justify-between items-center text-[#333333] border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                                            <div className="flex flex-col">
                                                                <p className="font-medium">
                                                                    <span className="text-gray-400 mr-2 font-bold">{item.quantity}x</span>
                                                                    {item.name}
                                                                </p>
                                                                {zoneName && (
                                                                    <div className="mt-1 inline-block px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[10px] font-bold tracking-wider uppercase w-fit">
                                                                        {zoneName}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* 🚀 NEW: Individual Item Status indicator & Price */}
                                                            <div className="flex items-center gap-3">
                                                                {item.itemStatus === 'Ready' ? (
                                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                                                        <CheckCircle size={12} /> Ready
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                                                                        <Clock size={12} /> Pending
                                                                    </span>
                                                                )}
                                                                <p className="text-gray-500 font-medium whitespace-nowrap min-w-[60px] text-right">
                                                                    ₦{(item.price * item.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end border-t border-gray-100 pt-5">
                                            <div>
                                                <p className="text-sm text-[#666666] mb-1">Total</p>
                                                <p className="text-[#4B2E05] font-bold text-2xl">
                                                    ₦{order.totalAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            
                                            <div className="flex gap-3">
                                                {isActive && (
                                                    <button 
                                                        onClick={(e) => markOrderComplete(order._id, e)}
                                                        className="bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-xl py-3 px-6 transition-colors active:scale-95 shadow-sm"
                                                    >
                                                        {completeLoading ? "..." : "Mark Complete"}
                                                    </button>
                                                )}

                                                {order.paymentStatus !== 'Paid' && (
                                                    <button 
                                                        onClick={(e) => markOrderPaid(order._id, e)}
                                                        disabled={paymentLoading === order._id}
                                                        className="bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl py-3 px-6 transition-colors active:scale-95 shadow-sm disabled:opacity-50"
                                                    >
                                                        {paymentLoading === order._id ? "..." : "Mark as Paid"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}