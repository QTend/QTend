"use client";

import React, { useState } from "react";
import { X, ChevronDown, Plus, Trash } from "lucide-react";
import { Modal } from "@/components/userAdmin/screen/Modal";
import { GradientButton } from "@/components/userAdmin/ui/Buttons";
import { useUserAdmin } from "@/context/UserAdminContext";

interface AreaData {
  id: string;
  areaName: string;
  prefix: string;
  count: number | '';
}

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTables: any[]) => void;
  existingAreas: string[];
}

export default function AddTableModal({ isOpen, onClose, onSuccess, existingAreas }: AddTableModalProps) {
  const { branch } = useUserAdmin();
  const [isLoading, setIsLoading] = useState(false);
  
  const [stagedAreas, setStagedAreas] = useState<AreaData[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | 'new'>('new');
  
  // NEW STATE: Tracks which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState<number | 'new' | null>(null);
  
  const [draftArea, setDraftArea] = useState<AreaData>({
    id: 'new', areaName: '', prefix: '', count: 5
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setStagedAreas([]);
    setDraftArea({ id: 'new', areaName: '', prefix: '', count: 5 });
    setExpandedIndex('new');
    setOpenDropdown(null);
    onClose();
  };

  const updateStagedArea = (index: number, field: string, value: any) => {
    setStagedAreas(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteArea = (indexToRemove: number) => {
    setStagedAreas(prev => prev.filter((_, i) => i !== indexToRemove));
    setExpandedIndex('new'); 
  };

  const handleAddMoreAreas = () => {
    if (expandedIndex === 'new') {
      if (!draftArea.areaName.trim()) {
        alert("Please provide an Area Name.");
        return;
      }
      if (!draftArea.count || draftArea.count <= 0) {
        alert("Please provide a valid number of tables.");
        return;
      }
      
      setStagedAreas(prev => [...prev, { ...draftArea, id: Date.now().toString() }]);
      setDraftArea({ id: 'new', areaName: '', prefix: '', count: 5 }); 
    }
    setExpandedIndex('new');
  };

  const handleCreateEverything = async () => {
    let finalAreas = [...stagedAreas];
    
    if (draftArea.areaName.trim() && draftArea.count && draftArea.count > 0) {
      finalAreas.push({ ...draftArea, id: Date.now().toString() });
    }

    if (finalAreas.length === 0) {
      alert("Please add at least one area to create tables.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/user-admin/${branch._id}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areas: finalAreas }) 
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.newTables);
        handleClose();                
      } else {
        alert(data.error || "Failed to sync tables"); 
      }
    } catch (error) {
      console.error("Failed to sync tables:", error);
      alert("Something went wrong syncing the tables.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (areaData: AreaData, index: number | 'new') => {
    const isNew = index === 'new';
    
    // Filter the dropdown list as the user types
    const filteredAreas = existingAreas.filter(area => 
      area.toLowerCase().includes(areaData.areaName.toLowerCase())
    );
    
    return (
      <div className="bg-[#EAECF0] p-4 rounded-b-2xl grid gap-4 border-t border-gray-200">
        
        {/* CUSTOM DROPDOWN IMPLEMENTATION */}
        <div className="relative flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#344054] uppercase tracking-wider">Name of area</label>
          <input 
            type="text" 
            value={areaData.areaName} 
            onChange={(e) => {
                isNew ? setDraftArea({ ...draftArea, areaName: e.target.value }) : updateStagedArea(index, 'areaName', e.target.value);
                setOpenDropdown(index); // Keep open while typing
            }} 
            onFocus={() => setOpenDropdown(index)}
            onBlur={() => setOpenDropdown(null)} // Close when clicking outside
            className="w-full rounded-lg bg-white px-3 py-2 text-sm outline-none focus:border-[#6da544] focus:ring-1 focus:ring-[#6da544]" 
            placeholder="e.g. VIP Lounge" 
          />
          
          {/* The Floating Dropdown Menu */}
          {openDropdown === index && filteredAreas.length > 0 && (
            <div className="absolute top-[100%] left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-40 overflow-y-auto">
              {filteredAreas.map((area, idx) => (
                <div 
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault(); // PREVENTS ONBLUR FROM FIRING FIRST
                    isNew ? setDraftArea({ ...draftArea, areaName: area }) : updateStagedArea(index, 'areaName', area);
                    setOpenDropdown(null);
                  }}
                  className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none"
                >
                  {area}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wider">Table Prefix</label>
            <input 
              type="text" 
              value={areaData.prefix} 
              onChange={(e) => isNew ? setDraftArea({ ...draftArea, prefix: e.target.value }) : updateStagedArea(index, 'prefix', e.target.value)} 
              className="w-full rounded-lg bg-white px-3 py-2 text-sm outline-none focus:border-[#6da544] focus:ring-1 focus:ring-[#6da544]" 
              placeholder="e.g. VIP" 
            />
          </div>
          
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wider">How many?</label>
            <input 
              type="number" 
              min="1"
              value={areaData.count} 
              onChange={(e) => isNew ? setDraftArea({ ...draftArea, count: parseInt(e.target.value) || '' }) : updateStagedArea(index, 'count', parseInt(e.target.value) || '')} 
              className="w-full rounded-lg bg-white px-3 py-2 text-sm outline-none focus:border-[#6da544] focus:ring-1 focus:ring-[#6da544]" 
            />
          </div>
        </div>

        {!isNew && (
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => handleDeleteArea(index)} 
              className="text-red-500 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash size={16} /> Remove Area
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
            <h3 className="text-xl font-bold text-slate-800">Create areas and tables</h3>
            <div onClick={handleClose} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex justify-center items-center cursor-pointer transition-colors text-slate-500">
              <X size={18} />
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Define an area and customize how the tables are numbered.
          </p>
        </div>

        {/* Scrollable Accordion Section */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col gap-3 mb-4">
            
            {/* Staged Areas Map */}
            {stagedAreas.map((area, index) => (
              <div key={area.id} className="flex flex-col shadow-sm">
                <div 
                  onClick={() => setExpandedIndex(expandedIndex === index ? 'new' : index)}
                  className={`bg-[#EAECF0] flex justify-between items-center p-4 cursor-pointer transition-colors hover:bg-gray-200 ${expandedIndex === index ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                >
                  <div>
                    <p className="text-[#101828] font-medium">{area.areaName || `Unnamed Area ${index + 1}`}</p>
                    <p className="text-xs text-slate-500">{area.count} tables • Prefix: {area.prefix || area.areaName}</p>
                  </div>
                  <ChevronDown className={`transition-transform duration-200 text-slate-400 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                </div>
                
                {expandedIndex === index && renderForm(area, index)}
              </div>
            ))}

            {/* Add Another Area Trigger */}
            <div className="flex flex-col mt-2 shadow-sm">
              {expandedIndex !== 'new' && stagedAreas.length > 0 && (
                <div 
                  onClick={() => setExpandedIndex('new')}
                  className="bg-[#68A544]/10 border border-[#68A544]/30 rounded-2xl flex justify-between items-center p-4 cursor-pointer hover:bg-[#68A544]/20 transition-colors"
                >
                  <p className="text-[#68A544] font-medium text-sm">Add another area</p>
                  <Plus className="text-[#68A544]" size={18} />
                </div>
              )}

              {/* The Drafting Area */}
              {expandedIndex === 'new' && (
                <div className={stagedAreas.length > 0 ? "mt-2" : ""}>
                  {stagedAreas.length > 0 && <p className="text-xs font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Drafting new area...</p>}
                  <div className="rounded-t-2xl overflow-hidden shadow-sm border border-slate-100">
                    {renderForm(draftArea, 'new')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {expandedIndex === 'new' ? (
            <div onClick={handleAddMoreAreas} className="mt-2 mb-4 bg-[#68A544] flex items-center text-white w-fit px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5b913b] transition-colors" >
              <Plus size={18} className="mr-1" />
              <p className="font-medium text-sm">Save & Add Another</p>
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
            label={isLoading ? "Syncing tables..." : `Sync Table Setup`}
            className="w-full" 
            disabled={isLoading || (stagedAreas.length === 0 && !draftArea.areaName)} 
          />
        </div>
        
      </div>
    </Modal>
  );
}