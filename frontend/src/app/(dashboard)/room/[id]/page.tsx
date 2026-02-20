"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { MapPin, Users, Radio, Shield, SignalHigh } from 'lucide-react';

export default function RiderRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const roomId = resolvedParams.id;
  const supabase = createClient();
  
  const [activeRiders, setActiveRiders] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'ONLINE' | 'OFFLINE'>('CONNECTING');

  useEffect(() => {
    const channel = supabase.channel(`room_${roomId}`, {
      config: { presence: { key: 'rider' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveRiders(Object.values(state).flat());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('ONLINE');
          navigator.geolocation.watchPosition((pos) => {
            channel.track({
              rider_id: 'RIDER_' + Math.floor(Math.random() * 1000), // Temporary ID generator
              coords: [pos.coords.latitude.toFixed(4), pos.coords.longitude.toFixed(4)],
              timestamp: new Date().toLocaleTimeString(),
              online: true
            });
          }, (err) => console.error(err), { enableHighAccuracy: true });
        }
      });

    return () => { 
        channel.unsubscribe(); 
        setConnectionStatus('OFFLINE');
    };
  }, [roomId, supabase]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-zinc-100 font-mono overflow-hidden">
      
      {/* --- LEFT SIDEBAR: TACTICAL LIST --- */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-xs text-zinc-500 uppercase tracking-[0.3em]">Squad_Room</h1>
            <p className="text-lg font-black italic text-orange-500">{roomId}</p>
          </div>
          <div className="flex flex-col items-end">
             <SignalHigh size={16} className={connectionStatus === 'ONLINE' ? 'text-emerald-500' : 'text-zinc-700'} />
             <span className="text-[8px] uppercase mt-1">{connectionStatus}</span>
          </div>
        </div>

        {/* Riders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Users size={14} className="text-zinc-500" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Active_Units ({activeRiders.length})
            </span>
          </div>

          {activeRiders.map((rider, idx) => (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-sm group hover:border-orange-500/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-zinc-200"># {rider.rider_id}</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1 rounded animate-pulse">LIVE</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin size={10} />
                <span className="text-[10px] font-mono tracking-tighter">
                  LAT: {rider.coords?.[0]} | LNG: {rider.coords?.[1]}
                </span>
              </div>
              <div className="mt-2 text-[8px] text-zinc-600 flex justify-between">
                <span>SYNC_TIME: {rider.timestamp}</span>
                <span className="text-orange-500/50 group-hover:text-orange-500">→ TELEMETRY</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
           <button className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]">
             Broadcast Location
           </button>
        </div>
      </aside>

      {/* --- MAIN SECTION: FOCUS AREA --- */}
      <main className="flex-1 relative flex flex-col">
        {/* Dynamic HUD Overlay (Desktop only) */}
        <div className="hidden md:block absolute top-6 right-6 z-10 space-y-4">
           <div className="bg-black/80 border-r-2 border-orange-500 p-4 backdrop-blur-md">
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Global_Status</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Radio size={12} className="text-orange-500" /> ENCRYPTED_LINK_ESTABLISHED
              </p>
           </div>
        </div>

        {/* Map Placeholder / Content Area */}
        <div className="flex-1 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="z-10 text-center space-y-6 max-w-md px-6">
                <div className="inline-block p-4 border border-zinc-800 bg-zinc-950/50">
                   <Shield size={48} className="mx-auto text-orange-500 mb-4 opacity-50" />
                   <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-2">Tactical_Grid_View</h2>
                   <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                     Real-time coordinates are being synced across the encrypted squad channel.
                     Movement of {activeRiders.length} units detected in the sector.
                   </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-zinc-800 bg-zinc-950/80">
                        <p className="text-[8px] text-zinc-500 uppercase">Sector</p>
                        <p className="text-lg font-bold">KOL-03</p>
                    </div>
                    <div className="p-4 border border-zinc-800 bg-zinc-950/80">
                        <p className="text-[8px] text-zinc-500 uppercase">Latency</p>
                        <p className="text-lg font-bold text-emerald-500">24ms</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden p-4 border-t border-zinc-800 bg-zinc-950 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-400">
           <div className="flex items-center gap-2">
              <Users size={12} /> Units: {activeRiders.length}
           </div>
           <div className="text-orange-500 font-bold">
              Room: {roomId}
           </div>
        </div>
      </main>
    </div>
  );
}