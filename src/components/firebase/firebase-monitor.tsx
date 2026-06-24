"use client";

import { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase/config";
import { Activity, Zap, Gauge, Clock, Play, Square } from "lucide-react";
import { useRouter } from "next/navigation";

interface FirebaseData {
  current: number;
  last_updated: number;
  power_watt: number;
  voltage: number;
}

export default function FirebaseMonitor() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const router = useRouter();
  
  // Ref for tracking recording state inside the onValue callback since it's a closure
  const isRecordingRef = useRef<boolean>(isRecording);
  const lastSyncRef = useRef<number | null>(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    const dataRef = ref(database, "/devices/ESP32_METER_01/live_data");
    
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const val = snapshot.val();
      
      if (val) {
        setData(val);
        
        // If recording is active and last_updated has changed, sync to Neon DB
        if (isRecordingRef.current && val.last_updated && val.last_updated !== lastSyncRef.current) {
          lastSyncRef.current = val.last_updated;
          
          try {
            await fetch("/api/firebase/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                current: val.current,
                voltage: val.voltage,
                power_watt: val.power_watt,
                last_updated: val.last_updated
              })
            });
            // Refresh router to update server components (e.g., the raw data table)
            router.refresh();
          } catch (err) {
            console.error("Failed to sync to Neon DB", err);
          }
        }
      } else {
        setError("Tidak ada data di Firebase (node tidak ditemukan)");
      }
    }, (err) => {
      console.error("Firebase subscription error:", err);
      setError("Gagal terhubung ke Firebase.");
    });

    return () => unsubscribe();
  }, [router]);

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-surface border border-border-gold rounded-xl flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-text-muted text-sm">Menghubungkan ke Firebase & Menunggu data...</p>
        </div>
      </div>
    );
  }

  let formattedDate = "-";
  if (data.last_updated) {
    const lastUpdatedDate = new Date(data.last_updated * 1000);
    if (!isNaN(lastUpdatedDate.getTime())) {
      formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(lastUpdatedDate);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-text-primary">Live Monitoring</h2>
          <p className="text-sm text-text-muted">Pantau status secara real-time dari perangkat ESP32</p>
        </div>
        <div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isRecording 
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={16} className="fill-current" />
                Stop Recording
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                Start Recording
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-gold/50">
          <div className="flex items-center gap-2 text-text-faint">
            <Activity size={16} className="text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Current</span>
          </div>
          <div className="text-2xl font-display font-bold text-text-primary">
            {data.current} <span className="text-sm text-text-muted font-normal">A</span>
          </div>
        </div>

        <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-gold/50">
          <div className="flex items-center gap-2 text-text-faint">
            <Zap size={16} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Voltage</span>
          </div>
          <div className="text-2xl font-display font-bold text-text-primary">
            {data.voltage} <span className="text-sm text-text-muted font-normal">V</span>
          </div>
        </div>

        <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-gold/50">
          <div className="flex items-center gap-2 text-text-faint">
            <Gauge size={16} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Power Watt</span>
          </div>
          <div className="text-2xl font-display font-bold text-text-primary">
            {data.power_watt} <span className="text-sm text-text-muted font-normal">W</span>
          </div>
        </div>

        <div className="bg-surface border border-border-gold rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-gold/50">
          <div className="flex items-center gap-2 text-text-faint">
            <Clock size={16} className="text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Last Updated</span>
          </div>
          <div className="text-base font-display font-semibold text-text-primary leading-tight mt-1">
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
