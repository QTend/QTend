'use client'

import { Hand, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useUserAdmin } from "@/context/UserAdminContext"
import { pusherClient } from "@/utils/pusher/pusherClient"

interface WaiterRequest {
    _id: string;
    tableNumber: string;
    requestType: string;
}

export const WaiterNotification = () => {
  const { branch } = useUserAdmin();
  const [activeRequests, setActiveRequests] = useState<WaiterRequest[]>([]);

  useEffect(() => {
    // TRAP 1: Did the branch load correctly so we can build the channel name?
    if (!branch?._id) {
        console.log("🛑 WaiterNotification: Waiting for branch ID...");
        return;
    }
    if (!pusherClient) {
        console.log("🛑 WaiterNotification: Pusher client is missing!");
        return;
    }

    const channelName = `branch-${branch._id}`;
    console.log(`🎧 WaiterNotification: Successfully Subscribed to ${channelName}`);
    
    const channel = pusherClient.subscribe(channelName);

    const handleWaiterCall = (newRequest: WaiterRequest) => {
        // TRAP 2: Did the message actually arrive from the backend?
        console.log("🚨 WAITER PING RECEIVED FROM BACKEND:", newRequest);
        setActiveRequests(prev => [...prev, newRequest]);
    };

    channel.bind('waiter-called', handleWaiterCall);

    return () => {
        channel.unbind('waiter-called', handleWaiterCall);
    };
  }, [branch?._id]);

  // TRAP 3: Is the state updating but just not rendering?
  useEffect(() => {
      console.log("📊 Current Active Requests in State:", activeRequests);
  }, [activeRequests]);

  if (activeRequests.length === 0) return null;

  const isMultiple = activeRequests.length > 1;
  const uniqueTables = Array.from(new Set(activeRequests.map(r => r.tableNumber)));
  const formattedTables = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(uniqueTables);
  
  const uniqueTypes = Array.from(new Set(activeRequests.map(r => r.requestType)));
  const formattedTypes = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(uniqueTypes);

  const title = isMultiple 
    ? "Several tables are requesting a waiter" 
    : `Table ${activeRequests[0].tableNumber} is requesting a waiter`;

  const description = isMultiple
    ? `Tables ${formattedTables} have active service requests including ${formattedTypes}. Please assign waiters to attend to them.`
    : `A guest at Table ${activeRequests[0].tableNumber} needs ${activeRequests[0].requestType}. Please respond to this request.`;

  const dismissNotifications = () => {
      setActiveRequests([]);
  };

  return (
    <div className="mb-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto bg-[#FEF0C7] border-[#FEC84B] border-2 rounded-2xl py-5 px-4 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center bg-[#436D2B] w-12 h-12 rounded-2xl text-white shrink-0">
                    <Hand size={24} />
                </div>
                <div>
                    <p className="font-bold text-base text-[#333333] mb-0.5">{title}</p>
                    <p className="font-medium text-sm text-[#666666] leading-snug">{description}</p>
                </div>
            </div>
            
            <button 
                onClick={dismissNotifications}
                className="bg-[#7D7D7D26] hover:bg-[#7D7D7D40] transition-colors w-8 h-8 rounded-full flex justify-center items-center shrink-0 cursor-pointer"
            >
                <X size={18} className="text-[#333333]" />
            </button>
        </div>
    </div>
  )
}