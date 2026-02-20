"use client";
import { User } from 'lucide-react';

export default function PresenceList({ riders }: { riders: any[] }) {
  return (
    <div className="p-4 bg-zinc-900/50 h-full border-r border-zinc-800">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
        Active in Room ({riders.length})
      </h3>
      <div className="space-y-3">
        {riders.map((rider, i) => (
          <div key={i} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                <User size={20} className="text-zinc-400" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">Rider_{rider.rider_id?.slice(0,4)}</p>
              <p className="text-[10px] text-zinc-500 italic">Moving...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}