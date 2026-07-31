"use client";

import React, { useEffect, useState, useRef } from "react";
import { Copy, ExternalLink, Inbox, X, Check, Download, Filter, CalendarRange, ChevronDown } from "lucide-react"; 
import { Modal } from "@/components/userAdmin/screen/Modal";
import { useUserAdmin } from "@/context/UserAdminContext";
import { QRCodeCanvas } from "qrcode.react";
import AddTableModal from "./AddTableModal";
import Area from "./Area";
import Zones from "./Zones";
import AddZoneModal from "./AddZoneModal";
import { useZone } from "@/context/ZoneContext";



export default function TablesSettings() {
  const  {branch} = useUserAdmin()
  const {tables, zones} = useZone()
  const [activeTab, setActiveTab] = useState('Areas');
  const [areaDrop, setAreaDrop] = useState(false)

  const tabs = ['Areas', 'Zones']
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoneModal, setIsZoneModal] = useState(false)

  // QR Code states
  const [qrModalTable, setQrModalTable] = useState<{ name: string; url: string } | null>(null);
 
  
  // 1. NEW FILTER STATE
  const [selectedArea, setSelectedArea] = useState<string>("All areas");

  const qrRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  



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

  // 2. EXTRACT UNIQUE AREAS AND FILTER THE DATA
  const existingAreas = Array.from(new Set(tables.map(t => t.area).filter(Boolean))) as string[];
  
  // This is the array we actually map over in the JSX!
  const displayedTables = selectedArea === "All areas" 
    ? tables 
    : tables.filter(t => t.area === selectedArea);

  return (
    <div className="w-full max-w-5xl space-y-6">
      
      {/* 1. Table Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
           <h2 className="text-lg font-semibold text-[#222222]">Zone and area management</h2>
          <button 
            onClick={() => activeTab === 'Areas' ? setIsModalOpen(true) : setIsZoneModal(true)}
            className="bg-[#6da544] hover:bg-[#5b8a39] transition-colors text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
          >
            {activeTab === 'Areas' ? 'Create New Areas' : 'Create New Zones'}
          </button>
        </div>

        {/* Tab */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {tabs.map((t, index) => (
              <div 
              onClick={() => setActiveTab(t)}
              key={index} 
              className={` text-sm px-5 py-3 cursor-pointer 
                ${activeTab === t ? 'border-b border-b-[#68A544] text-[#68A544]' : 'text-[#767676]'} 
                `}>{t}</div>
            ))}
          </div>
          {
            activeTab === 'Areas' 
            && 
            (<div 
            onClick={() => setAreaDrop(prev => !prev)}
            className="relative cursor-pointer flex items-center gap-3 px-5 py-1 rounded-xl bg-[#F2F4F7] text-xs font-medium">
            <CalendarRange  size={14}/>
            <span>{selectedArea}</span>
            <ChevronDown  size={14}/>

            {areaDrop && (
              <div className="absolute top-6 z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="py-1">
                  <button
                    type="button"
                    onMouseDown={() => setSelectedArea("All areas")} // onMouseDown fires before onBlur
                    className={`w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#6da544] ${
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
                        className={`w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#6da544] ${
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

        {
          activeTab === 'Areas' 
          ?  <Area baseUrl={baseUrl} branch={branch} displayedTables={displayedTables} tables={tables} setQrModalTable={setQrModalTable}/>
          : <Zones baseUrl={baseUrl} branch={branch}  zones={zones} setQrModalTable={setQrModalTable} />
        }
       
       
        
      </div>

      {/* 2. Menu URL Card (unchanged) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#222222]">Menu URL</h2>
        <p className="text-xs text-[#888888] mb-5">Your public menu link</p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#888888] mb-1 uppercase tracking-wider">Public menu link</p>
            <p className="text-sm font-medium">
              <span className="text-slate-800">{baseUrl}/</span>
              <span className="text-green-600 font-medium text-sm">{branch.slug}</span>
              <span className="text-slate-800">/menu</span>
            </p>
          </div>
          <button 
            onClick={() => window.open(`${baseUrl}/${branch.slug}/menu`, '_blank')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <ExternalLink size={16} className="text-slate-400" />
            Open
          </button>
        </div>
      </div>

      {/* 3. The Custom Table and Zone Modal */}
      <AddTableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newTables) => {
          // Re-fetch to ensure perfectly synced data rather than manually pushing arrays
          // since the backend might have deleted some tables during sync
          window.location.reload(); 
        }}
        existingAreas={existingAreas}
      />

       <AddZoneModal  
        isOpen={isZoneModal} 
        onClose={() => setIsZoneModal(false)} 
        onSuccess={(newTables) => {
          // Re-fetch to ensure perfectly synced data rather than manually pushing arrays
          // since the backend might have deleted some tables during sync
          window.location.reload(); 
        }}
        existingZones={existingAreas}
      />

      {/* 4. NEW QR Code Display Modal (unchanged) */}
      {qrModalTable && (
        <Modal center={true} onClick={() => setQrModalTable(null)}>
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-xl w-full max-w-[400px] relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQrModalTable(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Table {qrModalTable.name}</h3>
            
            <p className="text-xs text-gray-500 mb-6 truncate max-w-full px-4 text-center">
              {qrModalTable.url}
            </p>

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