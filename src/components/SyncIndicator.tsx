"use client";

import { useEffect, useState } from "react";
import offlineManager from "@/lib/OfflineManager";

export default function SyncIndicator() {
  const [queueSize, setQueueLength] = useState(0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = async () => {
      const count = await offlineManager.getPendingCount();
      setQueueLength(count);
      setOnline(navigator.onLine);
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const interval = setInterval(update, 3000);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      clearInterval(interval);
    };
  }, []);

  if (online && queueSize === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] animate-in fade-in slide-in-from-bottom-2">
      <div className={`px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${
        !online ? "bg-red-500 text-white" : "bg-blue-600 text-white"
      }`}>
        <div className={`h-2 w-2 rounded-full bg-white ${!online ? "animate-pulse" : "animate-spin"}`}></div>
        {!online ? "Device Offline" : `Syncing ${queueSize} Record(s)...`}
      </div>
    </div>
  );
}
