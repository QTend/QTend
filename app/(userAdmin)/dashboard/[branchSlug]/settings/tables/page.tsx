"use client";

import React, { useEffect, useState, useRef } from "react";
// Notice I added Check and Download icons for the new UI feedback
import { Copy, ExternalLink, Inbox, X, Check, Download } from "lucide-react"; 
import { Modal } from "@/components/userAdmin/screen/Modal";
import { GradientButton } from "@/components/userAdmin/ui/Buttons";
import { useUserAdmin } from "@/context/UserAdminContext";
import { QRCodeCanvas } from "qrcode.react"; // The new QR Code import
import AddTableModal from "./AddTableModal";

// Types for our table data
interface TableData {
  _id: string | number; // Changed to allow MongoDB string _ids
  name: string;
}

export default function TablesSettings() {
  const { branch } = useUserAdmin();
  const [tables, setTables] = useState<TableData[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New states for the QR Code and Copy features
  const [qrModalTable, setQrModalTable] = useState<{ name: string; url: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  
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



  // The new Copy Link Function with visual feedback
  const handleCopyLink = async (url: string, tableId: string | number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(tableId); // Set the active copied ID
      
      // Reset back to the Copy icon after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // The new Download QR Function
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
            className="bg-[#F67D26] hover:bg-[#d96a20] transition-colors text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
          >
            Create table QR code
          </button>
        </div>

        {tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Inbox size={50} strokeWidth={0.5} className="text-slate-300" />
            <p className="text-[#8C887E] text-sm mt-2">No tables added yet</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Table No</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Table Link</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => {
                  // Dynamically build the URL here!
                  const tableUrl = `${baseUrl}/${branch.slug}/menu?table=${table.name}`;

                  return (
                    <tr key={table._id} className="border-b border-gray-100 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800">{table.name}</span>
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
                            {/* Toggle between Copy and Check icon */}
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
        onSuccess={(newTables) => { // <-- Notice I renamed this to plural
          // Use the spread operator (...) to unpack the new array into the old array
          setTables((prev) => [...prev, ...newTables]); 
        }}
      />

      {/* 4. NEW QR Code Display Modal */}
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
            
            {/* We hide the overflow text so it doesn't break the modal width */}
            <p className="text-xs text-gray-500 mb-6 truncate max-w-full px-4 text-center">
              {qrModalTable.url}
            </p>

            {/* The QR Code Canvas */}
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
                className="flex-1 py-2.5 bg-[#F67D26] hover:bg-[#d96a20] text-white rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
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