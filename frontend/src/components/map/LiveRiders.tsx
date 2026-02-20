"use client";
import { Bike } from 'lucide-react';

interface Rider {
  rider_id: string;
  coords: [number, number]; // [lng, lat]
  label?: string;
}

interface MarkerProps {
  longitude: number;
  latitude: number;
  anchor: string;
  children: React.ReactNode;
}

const Marker = ({ children }: MarkerProps) => <div>{children}</div>;

export default function LiveRiders({ riders }: { riders: Rider[] }) {
  return (
    <>
      {riders.map((rider, index) => (
        <Marker 
          key={rider.rider_id || index} 
          longitude={rider.coords[0]} 
          latitude={rider.coords[1]}
          anchor="bottom"
        >
          <div className="flex flex-col items-center group">
            <div className="hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded mb-1 border border-zinc-700">
              {rider.label || "Nearby Rider"}
            </div>
            <div className="bg-orange-500 p-1.5 rounded-full border-2 border-white shadow-lg transform transition-transform hover:scale-125">
              <Bike size={16} className="text-black" />
            </div>
          </div>
        </Marker>
      ))}
    </>
  );
}