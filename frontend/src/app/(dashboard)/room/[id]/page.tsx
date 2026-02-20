"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import LiveRiders from '@/src/components/map/LiveRiders';

export default function RiderRoom({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [activeRiders, setActiveRiders] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`room_${params.id}`, {
      config: { presence: { key: 'rider' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveRiders(Object.values(state).flat());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          navigator.geolocation.watchPosition((pos) => {
            channel.track({
              rider_id: 'me',
              coords: [pos.coords.longitude, pos.coords.latitude]
            });
          });
        }
      });

    return () => { channel.unsubscribe(); };
  }, [params.id]);

  return (
    <div className="flex h-screen bg-zinc-900">
      <div className="w-1/4 border-r border-zinc-800 p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Rider Room: {params.id}</h1>
        <div className="space-y-2">
          {activeRiders.map((r, i) => (
            <div key={i} className="p-3 bg-zinc-800 rounded border border-zinc-700 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Rider {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-zinc-950">
         <LiveRiders riders={activeRiders} />
      </div>
    </div>
  );
}