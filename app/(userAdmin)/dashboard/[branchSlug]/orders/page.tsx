'use client'

import { useUserAdmin } from "@/context/UserAdminContext";
import { pusherClient } from "@/utils/pusher/pusherClient";
import { ChevronDown, ChevronUp, SlidersVertical } from "lucide-react"
import { useEffect, useState } from "react"

// Types matching our MongoDB Schema
interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;          // MongoDB _id
    orderNumber: string;  // e.g., "ORD-12345"
    tableNumber: string;
    totalAmount: number;
    status: 'Active' | 'Completed';
    items: OrderItem[];
    createdAt: string;
    specialInstructions?: string;
}

export default function KitchenOrders() {
    const {branch} = useUserAdmin()
    const branchId = branch._id;

    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [completeLoading, setCompleteLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState<'All Orders' | 'Active' | 'Completed'>('All Orders') // Default to Active is usually best for the kitchen!
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]) 

    const filters = ['All Orders', 'Active', 'Completed']

    useEffect(() =>{
        if(!branch?._id) {
            console.log('pusher didnt subscribe')
            return;
        };

        const channel = pusherClient.subscribe(`branch-${branch?._id}`);

        channel.bind('new-order', (incomingOrder: any) =>  {
            setOrders((prevOrder => [incomingOrder, ...prevOrder]))
        })


        return () => {
            pusherClient.unsubscribe(`branch-${branch?._id}`)
        }
    },[branch?._id]);

    const fetchOrders = async (showLoadingState = false) => {
        if (showLoadingState) setIsLoading(true);
        try {
            const res = await fetch(`/api/user-admin/${branchId}/orders`);
            const data = await res.json();
            console.log('odeer', data)
            if (res.ok) {
                setOrders(data.orders);
            
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (showLoadingState) setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders(true); // Initial fetch shows loading spinner

        // Silently fetch new orders every 10 seconds
        const interval = setInterval(() => {
            fetchOrders(false); 
        }, 10000); 

        return () => clearInterval(interval);
    }, [branchId]);

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
            setCompleteLoading(false)
            console.error(error);
            alert("Failed to update order. Reverting.");

        }
    }

    // =======================================================================
    // 3. UI HELPERS
    // =======================================================================
    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId) 
                : [...prev, orderId] 
        )
    }

    // Calculate "X mins ago" or "X hours ago" dynamically from MongoDB timestamp
    const getTimeAgo = (dateString: string) => {
        if (!dateString) return '';
        
        const diffInMinutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        
        if (diffInMinutes < 1) {
            return 'Just now';
        }
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        }
        
        // If it reaches 60 minutes or more, convert to hours
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'All Orders') return true;
        return order.status === activeFilter;
    })

    return  (
        <div className="mx-auto p-4 md:p-6">
            {/* ================= HEADER & FILTERS ================= */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                
                {/* Status Tabs */}
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
                    <div className="flex items-center bg-white py-2 px-3 gap-2 rounded-xl border border-gray-200 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                        <SlidersVertical size={16} className="text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">Last 30 mins</p>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div>
                </div>
            </div>

            {/* ================= ORDERS LIST ================= */}
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

                        return (
                            <div 
                                key={order._id} 
                                className={`bg-white rounded-2xl p-4 md:p-5 transition-all shadow-sm border ${
                                    isExpanded ? 'border-blue-200' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                {/* Card Header */}
                                <div 
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid gap-1">
                                            <p className="text-[#333333] font-bold text-lg">{order.orderNumber}</p>
                                            <p className="text-sm text-[#F97316] font-medium">{getTimeAgo(order.createdAt)}</p>
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                            isActive ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-green-50 text-green-600 border-green-200'
                                        }`}>
                                            {isActive ? 'Active' : 'Completed'}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-gray-100 transition-colors text-gray-500">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {/* Card Body */}
                                {isExpanded && (
                                    <div className="mt-5 pt-5 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[#333333]">
                                                Table: <span className="text-xl font-bold ml-1 text-[#F97316]">#{order.tableNumber}</span>
                                            </p>
                                        </div>

                                        {/* Display Special Instructions if they exist! */}
                                        {order.specialInstructions && (
                                            <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-xl">
                                                <p className="text-xs text-orange-400 font-bold uppercase mb-1">Special Instructions:</p>
                                                <p className="text-orange-800 text-sm font-medium">{order.specialInstructions}</p>
                                            </div>
                                        )}

                                        {/* Items List */}
                                        <div className="mb-6">
                                            <p className="text-[#666666] text-sm mb-2">Items:</p>
                                            <div className="flex flex-col gap-2">
                                                {order.items.map((item, index) => (
                                                    <div key={item._id || index} className="flex justify-between items-start text-[#333333]">
                                                        <p className="font-medium">
                                                            <span className="text-gray-400 mr-2 font-bold">{item.quantity}x</span>
                                                            {item.name}
                                                        </p>
                                                        <p className="text-gray-500 font-medium whitespace-nowrap ml-4">
                                                            ₦{(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer: Total & Action Button */}
                                        <div className="flex justify-between items-end border-t border-gray-100 pt-5">
                                            <div>
                                                <p className="text-sm text-[#666666] mb-1">Total</p>
                                                <p className="text-[#4B2E05] font-bold text-2xl">
                                                    ₦{order.totalAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            
                                            {/* Only show the action button if the order is Active */}
                                            {isActive && (
                                                <button 
                                                    onClick={(e) => markOrderComplete(order._id, e)}
                                                    className="bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-xl py-3 px-6 transition-colors active:scale-95 shadow-sm"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
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