"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/userAdmin/screen/Modal";
import { GradientButton } from "@/components/userAdmin/ui/Buttons";
import { useUserAdmin } from "@/context/UserAdminContext";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Note: onSuccess now expects an ARRAY of new tables since we are bulk generating
  onSuccess: (newTables: any[]) => void; 
}

export default function AddTableModal({ isOpen, onClose, onSuccess }: AddTableModalProps) {
  const { branch } = useUserAdmin();
  
  // The two new states for our smart generator
  const [prefix, setPrefix] = useState("Table"); 
  const [count, setCount] = useState<string>("5");
  
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateTables = async () => {
    const targetCount = parseInt(count);
    if (isNaN(targetCount) || targetCount <= 0) return;
    
    setIsLoading(true);

    try {
      const res = await fetch(`/api/user-admin/${branch._id}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prefix: prefix.trim(), 
          count: targetCount 
        }) 
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.newTables); // Send the array of new tables to the parent
        setCount("5");             // Reset defaults
        setPrefix("Table");
        onClose();                 
      } else {
        alert(data.error || "Failed to create tables"); 
      }
    } catch (error) {
      console.error("Failed to create tables:", error);
      alert("Something went wrong creating the tables.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal center={true} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h3 className="text-xl font-bold text-slate-800">Bulk create tables</h3>
          <p className="text-sm text-slate-500 mt-1">
            Generate multiple tables or rooms at once.
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="flex gap-4 mb-6">
            {/* The Prefix Input */}
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Label (Optional)
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. Room, Cabana"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F17B2C]/20 focus:border-[#F17B2C] transition-all"
              />
            </div>

            {/* The Count Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                How many?
              </label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F17B2C]/20 focus:border-[#F17B2C] transition-all"
              />
            </div>
          </div>

          <GradientButton 
            label={isLoading ? "Generating..." : `Create ${count || 0} tables`} 
            className="w-full" 
            onClick={handleCreateTables} 
          />
        </div>
      </div>
    </Modal>
  );
}