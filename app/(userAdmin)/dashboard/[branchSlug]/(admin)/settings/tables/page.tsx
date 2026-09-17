"use client";

import React, { useEffect, useState, useRef } from "react";
import { Copy, ExternalLink, Inbox, X, Check, Download, Filter, CalendarRange, ChevronDown, Lock, Rocket } from "lucide-react"; 
import { Modal } from "@/components/userAdmin/screen/Modal";
import { useUserAdmin } from "@/context/UserAdminContext";
import { QRCodeCanvas } from "qrcode.react";
import AddTableModal from "./AddTableModal";
import Area from "./Area";
import Zones from "./Zones";
import AddZoneModal from "./AddZoneModal";
import { useZone } from "@/context/ZoneContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function TablesSettings() {
  const { branch } = useUserAdmin();
  const { tables, zones } = useZone();
  const [activeTab, setActiveTab] = useState('Areas');
  const [areaDrop, setAreaDrop] = useState(false);
  
  const router = useRouter();
  const params = useSearchParams();
  const zone = params.get('tab');

  useEffect(() => {
    if (zone) {
      setActiveTab(zone);
    }
  }, [zone]);

  const tabs = ['Areas', 'Zones'];
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoneModal, setIsZoneModal] = useState(false);

  // QR Code states
  const [qrModalTable, setQrModalTable] = useState<{ name: string; url: string } | null>(null);
 
  // FILTER STATE
  const [selectedArea, setSelectedArea] = useState<string>("All areas");

  const qrRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // 🚀 SECURITY: Define access logic based on plans
  const currentPlan = branch?.plans?.planType || 'basic';
  const canAccessAreas = currentPlan === 'starter' || currentPlan === 'pro';
  const canAccessZones = currentPlan === 'pro';

  const downloadQRCode = () => {
    if (!qrModalTable) return;
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${branch.slug}-table-${qrModalTable.name}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const existingAreas = Array.from(new Set(tables.map(t => t.area).filter(Boolean))) as string[];
  
  const displayedTables = selectedArea === "All areas" 
    ? tables 
    : tables.filter(t => t.area === selectedArea);

  // 🚀 NEW: Inline Upsell Component for locked tabs
  const InlineLockedState = ({ title, description, requiredPlan }: { title: string, description: string, requiredPlan: string }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-b-xl">
      <div className="w-16 h-16 bg-[#FFF7ED] text-[#F67D26] rounded-2xl flex items-center justify-center mb-4 border border-[#FFEDD5]">
        <Lock size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      <button 
        onClick={() => router.push(`/dashboard/${branch.slug}/billing`)}
        className="bg-[#F67D26] hover:bg-[#e0691c] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
      >
        <Rocket size={18} /> Upgrade to {requiredPlan}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl space-y-6">
      
      {/* 1. Menu URL Card (Always visible, even on Basic) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#222222]">Menu URL</h2>
        <p className="text-xs text-[#888888] mb-5">Your public menu link</p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#888888] mb-1 uppercase tracking-wider">Public menu link</p>
            <p className="text-sm font-medium">
              <span className="text-slate-800">{baseUrl}/</span>
              <span className="text-green-600 font-medium text-sm">{branch?.slug}</span>
              <span className="text-slate-800">/menu</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setQrModalTable({ name: 'General Menu', url: `${baseUrl}/${branch?.slug}/menu` })}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              View QR
            </button>
            <button 
              onClick={() => window.open(`${baseUrl}/${branch?.slug}/menu`, '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#6da544] bg-[#6da544] text-white rounded-lg text-sm font-medium hover:bg-[#5b8a39] transition-colors whitespace-nowrap"
            >
              <ExternalLink size={16} className="text-white" />
              Open
            </button>
          </div>
        </div>
      </div>

      {/* 2. Table Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
           <h2 className="text-lg font-semibold text-[#222222]">Zone and area management</h2>
          
           {/* 🚀 SECURITY: Only show Create button if they have access to the current tab */}
           {((activeTab === 'Areas' && canAccessAreas) || (activeTab === 'Zones' && canAccessZones)) && (
              <button 
                onClick={() => activeTab === 'Areas' ? setIsModalOpen(true) : setIsZoneModal(true)}
                className="bg-[#6da544] hover:bg-[#5b8a39] transition-colors text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
              >
                {activeTab === 'Areas' ? 'Create New Areas' : 'Create New Zones'}
              </button>
           )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center">
            {tabs.map((t, index) => (
              <div 
                onClick={() => setActiveTab(t)}
                key={index} 
                className={`text-sm px-5 py-3 cursor-pointer ${
                  activeTab === t ? 'border-b-2 border-[#68A544] text-[#68A544] font-medium' : 'text-[#767676]'
                }`}
              >
                {t}
              </div>
            ))}
          </div>
          
          {/* 🚀 SECURITY: Only show filter dropdown if they have access to Areas */}
          {activeTab === 'Areas' && canAccessAreas && (
            <div 
              onClick={() => setAreaDrop(prev => !prev)}
              className="relative cursor-pointer flex items-center gap-3 px-5 py-1 mr-4 rounded-xl bg-[#F2F4F7] text-xs font-medium"
            >
              <CalendarRange size={14}/>
              <span>{selectedArea}</span>
              <ChevronDown size={14}/>

              {areaDrop && (
                <div className="absolute top-8 right-0 z-10 w-48 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="py-1">
                    <button
                      type="button"
                      onMouseDown={() => setSelectedArea("All areas")}
                      className={`w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#6da544] ${
                        selectedArea === "All areas" ? 'bg-slate-50 text-[#6da544] font-medium' : ''
                      }`}
                    >
                      All Areas ({tables.length})
                    </button>
                    
                    {existingAreas.map((area, idx) => {
                      const count = tables.filter(t => t.area === area).length;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onMouseDown={() => setSelectedArea(area)}
                          className={`w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#6da544] ${
                            selectedArea === area ? 'bg-slate-50 text-[#6da544] font-medium' : ''
                          }`}
                        >
                          {area} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Content Gating */}
        {activeTab === 'Areas' ? (
          canAccessAreas ? (
            <Area baseUrl={baseUrl} branch={branch} displayedTables={displayedTables} tables={tables} setQrModalTable={setQrModalTable}/>
          ) : (
            <InlineLockedState 
              title="Table Ordering Restricted"
              description="Generating specific QR codes for tables allows customers to order directly from their seats. Upgrade to accept live table orders."
              requiredPlan="Starter or Pro"
            />
          )
        ) : (
          canAccessZones ? (
            <Zones baseUrl={baseUrl} branch={branch} zones={zones} setQrModalTable={setQrModalTable} />
          ) : (
            <InlineLockedState 
              title="Multi-Zone KDS Restricted"
              description="Route orders to specific preparation zones like the Kitchen, Bar, or Grill automatically."
              requiredPlan="Pro"
            />
          )
        )}
      </div>

      {/* 3. The Custom Table and Zone Modals */}
      <AddTableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()}
        existingAreas={existingAreas}
      />

       <AddZoneModal  
        isOpen={isZoneModal} 
        onClose={() => setIsZoneModal(false)} 
        onSuccess={() => window.location.reload()}
        existingZones={existingAreas}
      />

      {/* 4. QR Code Display Modal */}
      {qrModalTable && (
        <Modal center={true} onClick={() => setQrModalTable(null)}>
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-xl w-full max-w-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQrModalTable(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {qrModalTable.name === 'General Menu' ? 'General Menu QR' : `Table ${qrModalTable.name}`}
            </h3>

            <div ref={qrRef} className="p-4 bg-white border-2 border-slate-100 rounded-2xl mb-8 shadow-sm">
              <QRCodeCanvas 
                value={qrModalTable.url} 
                size={220} 
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"} 
                includeMargin={false}
              />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setQrModalTable(null)}
                className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={downloadQRCode}
                className="flex-1 py-2.5 bg-[#6da544] hover:bg-[#5b8a39] text-white rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}