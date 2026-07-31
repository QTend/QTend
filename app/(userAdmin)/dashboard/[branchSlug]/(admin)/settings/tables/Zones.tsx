import { Check, Copy, ExternalLink, Inbox } from "lucide-react";
import { useState } from "react";

interface AreaProp {
  branch: any;
  setQrModalTable: any;
  baseUrl: any;
  zones: any;
}

const Zones = ({ branch, setQrModalTable, baseUrl, zones }: AreaProp) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleCopyLink = async (url: string, tableId: string | number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(tableId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <>
      {zones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Inbox size={50} strokeWidth={0.5} className="text-slate-300" />
          <p className="text-[#8C887E] text-sm mt-2">No zones added yet</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">ZOne name</th>
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">ZONE LINK</th>
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {/* 4. MAP OVER DISPLAYED TABLES INSTEAD OF ALL TABLES */}
              {zones.map((zone: any) => {
                const tableUrl = `${baseUrl}/${branch.slug}/zone?zone=${zone.name.toLowerCase()}`;

                return (
                  <tr key={zone._id} className="border-b border-gray-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{zone.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-sm">
                          <span className="text-slate-400">{baseUrl}/</span>
                          <span className="text-green-600 font-medium">{branch.slug}</span>
                          <span className="text-slate-500">/menu?zone={zone.name.toLowerCase()}</span>
                        </span>
                        <button
                          onClick={() => handleCopyLink(tableUrl, zone._id)}
                          className={`${copiedId === zone._id ? "text-green-500" : "text-slate-400 hover:text-slate-600"} transition-colors`}
                          title="Copy link"
                        >
                          {copiedId === zone._id ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setQrModalTable({ name: zone.name, url: tableUrl })}
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
    </>
  );
};

export default Zones;