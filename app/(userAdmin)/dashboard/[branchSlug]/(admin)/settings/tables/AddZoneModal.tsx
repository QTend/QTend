"use client";

import React, { useState } from "react";
import { X, ChevronDown, Plus, Trash } from "lucide-react";
import { Modal } from "@/components/userAdmin/screen/Modal";
import { GradientButton } from "@/components/userAdmin/ui/Buttons";
import { useUserAdmin } from "@/context/UserAdminContext";

interface ZoneData {
  id: string;
  zoneName: string;
  
}

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTables: any[]) => void;
  existingZones: string[];
}

export default function AddZoneModal({ isOpen, onClose, onSuccess, existingZones }: AddTableModalProps) {
  const { branch } = useUserAdmin();
  const [isLoading, setIsLoading] = useState(false);
  
  const [stageZone, setStageZone] = useState<ZoneData[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | 'new'>('new');
  
  // NEW STATE: Tracks which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState<number | 'new' | null>(null);
  
  const [draftzone, setDraftZone] = useState<ZoneData>({
    id: 'new', zoneName: ''
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setStageZone([]);
    setDraftZone({ id: 'new',zoneName: '' });
    setExpandedIndex('new');
    setOpenDropdown(null);
    onClose();
  };

  const updateStagedZone = (index: number, field: string, value: any) => {
    setStageZone(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteZone = (indexToRemove: number) => {
    setStageZone(prev => prev.filter((_, i) => i !== indexToRemove));
    setExpandedIndex('new'); 
  };

  const handleAddMoreZone = () => {
    if (expandedIndex === 'new') {
      if (!draftzone.zoneName.trim()) {
        alert("Please provide an Zone Name.");
        return;
      }
      
      setStageZone(prev => [...prev, { ...draftzone, id: Date.now().toString() }]);
      setDraftZone({ id: 'new', zoneName: '' }); 
    }
    setExpandedIndex('new');
  };

  const handleCreateEverything = async () => {
    let finalZones = [...stageZone];
    
    if (draftzone.zoneName.trim() ) {
      finalZones.push({ ...draftzone, id: Date.now().toString() });
    }

    if (finalZones.length === 0) {
      alert("Please add at least one zone to create tables.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/user-admin/${branch._id}/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: finalZones }) 
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.newTables);
        handleClose();                
      } else {
        alert(data.error || "Failed to sync zone"); 
      }
    } catch (error) {
      console.error("Failed to sync tables:", error);
      alert("Something went wrong syncing the tables.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (zoneData: ZoneData, index: number | 'new') => {
    const isNew = index === 'new';
    
   
    
    return (
      <div className="bg-[#EAECF0] p-4 rounded-b-2xl grid gap-4 border-t border-gray-200">
        
        {/* CUSTOM DROPDOWN IMPLEMENTATION */}
        <div className="relative flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#344054] uppercase tracking-wider">Name of zone</label>
          <input 
            type="text" 
            value={zoneData.zoneName} 
            onChange={(e) => {
                isNew ? setDraftZone({ ...draftzone, zoneName: e.target.value }) : updateStagedZone(index, 'zoneName', e.target.value);
                setOpenDropdown(index); // Keep open while typing
            }} 
            onFocus={() => setOpenDropdown(index)}
            onBlur={() => setOpenDropdown(null)} // Close when clicking outside
            className="w-full rounded-lg bg-white px-3 py-2 text-sm outline-none focus:border-[#6da544] focus:ring-1 focus:ring-[#6da544]" 
            placeholder="e.g. Kitchen, Bar, Grills" 
          />
          
        </div>

        {!isNew && (
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => handleDeleteZone(index)} 
              className="text-red-500 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash size={16} /> Remove Zone
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal center={true} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-xl w-full max-w-[450px] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-slate-800">Create Zones</h3>
            <div onClick={handleClose} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex justify-center items-center cursor-pointer transition-colors text-slate-500">
              <X size={18} />
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Your menu items would be connected to zones
          </p>
        </div>

        {/* Scrollable Accordion Section */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col gap-3 mb-4">
            
            {/* Staged Zone Map */}
            {stageZone.map((zone, index) => (
              <div key={zone.id} className="flex flex-col shadow-sm">
                <div 
                  onClick={() => setExpandedIndex(expandedIndex === index ? 'new' : index)}
                  className={`bg-[#EAECF0] flex justify-between items-center p-4 cursor-pointer transition-colors hover:bg-gray-200 ${expandedIndex === index ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                >
                  <div>
                    <p className="text-[#101828] font-medium">{zone.zoneName || `Unnamed Zone ${index + 1}`}</p>
                   
                  </div>
                  <ChevronDown className={`transition-transform duration-200 text-slate-400 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                </div>
                
                {expandedIndex === index && renderForm(zone, index)}
              </div>
            ))}

            {/* Add Another Zone Trigger */}
            <div className="flex flex-col mt-2 shadow-sm">
              {expandedIndex !== 'new' && stageZone.length > 0 && (
                <div 
                  onClick={() => setExpandedIndex('new')}
                  className="bg-[#68A544]/10 border border-[#68A544]/30 rounded-2xl flex justify-between items-center p-4 cursor-pointer hover:bg-[#68A544]/20 transition-colors"
                >
                  <p className="text-[#68A544] font-medium text-sm">Add another zone</p>
                  <Plus className="text-[#68A544]" size={18} />
                </div>
              )}

              {/* The Drafting Zone */}
              {expandedIndex === 'new' && (
                <div className={stageZone.length > 0 ? "mt-2" : ""}>
                  {stageZone.length > 0 && <p className="text-xs font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Drafting new zone...</p>}
                  <div className="rounded-t-2xl overflow-hidden shadow-sm border border-slate-100">
                    {renderForm(draftzone, 'new')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {expandedIndex === 'new' ? (
            <div onClick={handleAddMoreZone} className="mt-2 mb-4 bg-[#68A544] flex items-center text-white w-fit px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5b913b] transition-colors" >
              <Plus size={18} className="mr-1" />
              <p className="font-medium text-sm">Add another zone</p>
            </div>
          ) : (
            <div onClick={() => setExpandedIndex('new')} className="mt-2 mb-4 bg-gray-100 flex items-center text-gray-700 w-fit px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors" >
              <p className="font-medium text-sm">Done Editing</p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
          <GradientButton 
            onClick={handleCreateEverything} 
            label={isLoading ? "Creating zoness..." : `Sync Zone Setup`}
            className="w-full" 
            disabled={isLoading || (stageZone.length === 0 && !draftzone.zoneName)} 
          />
        </div>
        
      </div>
    </Modal>
  );
}