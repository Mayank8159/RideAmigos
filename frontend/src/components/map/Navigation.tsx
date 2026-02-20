"use client";
import { MapPin, Navigation as NavIcon } from 'lucide-react';

interface NavProps {
  start: { lng: number; lat: number } | null;
  end: { lng: number; lat: number } | null;
  onCalculate: () => void;
}

export default function Navigation({ start, end, onCalculate }: NavProps) {
  return (
    <div className="absolute top-4 left-4 z-10 w-72 bg-zinc-950/90 backdrop-blur-md p-4 rounded-xl border border-zinc-800 shadow-2xl">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
          <MapPin size={16} className="text-green-500" />
          <span className="text-xs text-zinc-400 truncate">
            {start ? `${start.lat.toFixed(4)}, ${start.lng.toFixed(4)}` : "Click map for Start"}
          </span>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
          <MapPin size={16} className="text-red-500" />
          <span className="text-xs text-zinc-400 truncate">
            {end ? `${end.lat.toFixed(4)}, ${end.lng.toFixed(4)}` : "Click map for End"}
          </span>
        </div>

        <button 
          onClick={onCalculate}
          disabled={!start || !end}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition"
        >
          <NavIcon size={16} />
          GENERATE ROUTE
        </button>
      </div>
    </div>
  );
}