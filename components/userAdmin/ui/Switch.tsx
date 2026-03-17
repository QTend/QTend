'use client'

import { useState } from "react";

export default function Switch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-9 h-5  flex items-center rounded-full p-1 transition ${
        enabled ? "bg-[#F97316]" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-4" : "-translate-x-1"
        }`}
      />
    </button>
  );
}