"use client";

import React, { useEffect, useState, useRef } from "react";
import { Copy, ExternalLink, Inbox, X, Check, Download, Filter } from "lucide-react"; 
import { Modal } from "@/components/userAdmin/screen/Modal";
import { useUserAdmin } from "@/context/UserAdminContext";
import { QRCodeCanvas } from "qrcode.react";
import AddTableModal from "./AddTableModal";

interface TableData {
  _id: string | number;
  name: string;
  area?: string; // Ensure this is here!
}

export default function TablesSettings() {
  const { branch } = useUserAdmin();
  const [tables, setTables] = useState<TableData[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // QR Code states
  const [qrModalTable, setQrModalTable] = useState<{ name: string; url: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  
  // 1. NEW FILTER STATE
  const [selectedArea, setSelectedArea] = useState<string>("All");

  const qrRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch(`/api/user-admin/${branch._id}/tables`); 
        const data = await res.json();
        if (data.success) setTables(data.tables);
      } catch (error) {
        console.error("Failed to fetch tables", error);
      }
    }
    
    if (branch?._id) fetchTables();
  }, [branch?._id]);

  const handleCopyLink = async (url: string, tableId: string | number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(tableId); 
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

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
  const displayedTables = selectedArea === "All" 
    ? tables 
    : tables.filter(t => t.area === selectedArea);

  return (
    <div className="w-full max-w-5xl space-y-6">
      
      {/* 1. Table Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-[#222222]">Table management</h2>
            <p className="text-xs text-[#888888] mt-0.5">Settings on how tables and QR codes work</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#6da544] hover:bg-[#5b8a39] transition-colors text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
          >
            Create / Sync tables
          </button>
        </div>

        {/* 3. NEW FILTER UI BAR */}
        {tables.length > 0 && existingAreas.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-gray-100 flex items-center gap-3">
             <Filter size={16} className="text-slate-400" />
             <span className="text-sm font-medium text-slate-600">Filter by Area:</span>
             <select 
               value={selectedArea}
               onChange={(e) => setSelectedArea(e.target.value)}
               className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#6da544] cursor-pointer shadow-sm"
             >
                <option value="All">All Areas ({tables.length})</option>
                {existingAreas.map((area, idx) => {
                  const count = tables.filter(t => t.area === area).length;
                  return (
                    <option key={idx} value={area}>
                      {area} ({count})
                    </option>
                  );
                })}
             </select>
          </div>
        )}

        {tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Inbox size={50} strokeWidth={0.5} className="text-slate-300" />
            <p className="text-[#8C887E] text-sm mt-2">No tables added yet</p>
          </div>
        ) : displayedTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-[#8C887E] text-sm mt-2">No tables found in this area.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Table No</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Area</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Table Link</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* 4. MAP OVER DISPLAYED TABLES INSTEAD OF ALL TABLES */}
                {displayedTables.map((table) => {
                  const tableUrl = `${baseUrl}/${branch.slug}/menu?table=${table.name}`;

                  return (
                    <tr key={table._id} className="border-b border-gray-100 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800">{table.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {table.area || "Main"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-sm">
                            <span className="text-slate-400">{baseUrl}/</span>
                            <span className="text-green-600 font-medium">{branch.slug}</span>
                            <span className="text-slate-500">/menu?table={table.name}</span>
                          </span>
                          <button 
                            onClick={() => handleCopyLink(tableUrl, table._id)}
                            className={`${copiedId === table._id ? "text-green-500" : "text-slate-400 hover:text-slate-600"} transition-colors`} 
                            title="Copy link"
                          >
                            {copiedId === table._id ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setQrModalTable({ name: table.name, url: tableUrl })}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-400" />
                          View QR code
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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

      {/* 3. The Custom Table Modal */}
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