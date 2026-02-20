"use client";
import React, { useEffect, useState } from 'react'; // Ensure React is imported
import { createClient } from '@/src/lib/supabase/client';

// 1. Update the type definition for params
export default function RiderRoom({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Unwrap the params using React.use()
  const resolvedParams = React.use(params);
  const roomId = resolvedParams.id;

  const supabase = createClient();
  const [activeRiders, setActiveRiders] = useState<any[]>([]);

  useEffect(() => {
    // 3. Use the unwrapped roomId for the channel
    const channel = supabase.channel(`room_${roomId}`, {
      config: { presence: { key: 'rider' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveRiders(Object.values(state).flat());
      })
      .subscribe(async (status: string) => {
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
  }, [roomId, supabase]); // Add roomId to dependency array

  return (
    <div className="flex h-screen bg-zinc-900">
      <div className="w-1/4 border-r border-zinc-800 p-4">
        {/* 4. Use roomId in the UI */}
        <h1 className="text-xl font-bold mb-4">Rider Room: {roomId}</h1>
        {/* ... rest of your code */}
      </div>
    </div>
  );
}