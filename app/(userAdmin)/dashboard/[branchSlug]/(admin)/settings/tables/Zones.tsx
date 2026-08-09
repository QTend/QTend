import { Check, Copy, ExternalLink, Inbox, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface AreaProp {
  branch: any;
  setQrModalTable: any;
  baseUrl: any;
  zones: any[];
}

const Zones = ({ branch, setQrModalTable, baseUrl, zones }: AreaProp) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  
  // 🚀 THE FIX: A dictionary to store tokens we just generated so the parent can't overwrite them
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, string>>({});

  const [zoneToReset, setZoneToReset] = useState<any | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleCopyLink = async (url: string, zoneId: string | number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(zoneId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleRegenerateToken = async () => {
    if (!zoneToReset) return;
    setIsResetting(true);

    try {
      const res = await fetch(`/api/user-admin/${branch._id}/zones/${zoneToReset._id}/reset-token`, {
        method: 'PATCH',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 🚀 THE FIX: Save the new token in our override dictionary
        setTokenOverrides(prev => ({
            ...prev,
            [zoneToReset._id]: data.token
        }));
        
        setZoneToReset(null); // Close modal
      } else {
        alert(data.error || "Failed to reset token.");
      }
    } catch (error) {
      console.error("Error resetting token:", error);
      alert("Something went wrong.");
    } finally {
      setIsResetting(false);
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
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">Zone Name</th>
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider">KDS Magic Link</th>
                <th className="py-4 px-6 text-xs font-bold text-[#98A2B3] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone: any) => {
                // 🚀 THE FIX: Check if we have a new token in state, otherwise use the database one
                const activeToken = tokenOverrides[zone._id] || zone.magicToken;
                
                // Construct the URL using the activeToken
                const kdsUrl = `${baseUrl}/kds/${branch.slug}/zone?zone=${zone.name.toLowerCase()}&token=${activeToken}`;

                return (
                  <tr key={zone._id} className="border-b border-gray-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{zone.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-sm max-w-[250px] truncate block">
                          <span className="text-slate-400">/kds/</span>
                          <span className="text-green-600 font-medium">{branch.slug}</span>
                          <span className="text-slate-500">?zone={zone.name.toLowerCase()}</span>
                          
                          {/* Display the activeToken */}
                          {activeToken ? (
                             <span className="text-orange-400 font-medium">&token={activeToken.slice(0, 8)}...</span>
                          ) : (
                             <span className="text-red-400 font-medium">&token=Missing</span>
                          )}
                        </span>
                        <button
                          onClick={() => handleCopyLink(kdsUrl, zone._id)}
                          className={`${copiedId === zone._id ? "text-green-500" : "text-slate-400 hover:text-slate-600"} transition-colors ml-2 p-1.5 rounded-md hover:bg-slate-100`}
                          title="Copy full KDS link"
                        >
                          {copiedId === zone._id ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setZoneToReset(zone)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Generate a new token"
                        >
                          <RefreshCw size={14} />
                          Reset Link
                        </button>
                        {/* <button
                          onClick={() => setQrModalTable({ name: zone.name, url: kdsUrl })}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-400" />
                          QR Code
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {zoneToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset {zoneToReset.name} Link?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              This will generate a brand new security token. Any iPad currently using the old link will be instantly disconnected and will require the new link.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setZoneToReset(null)}
                disabled={isResetting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRegenerateToken}
                disabled={isResetting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isResetting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Yes, Reset It"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Zones;