export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-orange-100 text-[#F67D26] rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold">
        ⚡
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">You are offline</h1>
      <p className="text-gray-600 text-sm max-w-xs mb-6">
        Please check your internet connection to continue updating orders and sync data.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-[#68A544] text-white px-6 py-2.5 rounded-xl font-medium text-sm"
      >
        Retry Connection
      </button>
    </div>
  );
}