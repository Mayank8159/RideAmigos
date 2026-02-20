"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Navigation, Gauge, Timer, MapPin } from 'lucide-react';

// 1. Define the actual Map logic as a separate internal component
const MapContent = () => {
  // We require these inside the component to avoid top-level server crashes
  const { MapContainer, TileLayer, Marker, Polyline, useMapEvents } = require('react-leaflet');
  const L = require('leaflet');

  const [points, setPoints] = useState<{ start: any; end: any }>({ start: null, end: null });
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [stats, setStats] = useState({ distance: 0, duration: 0, speed: 0 });

  // Icon fix
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  function MapClickHandler() {
    useMapEvents({
      click: (e: any) => {
        const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        if (!points.start || (points.start && points.end)) {
          setPoints({ start: newPoint, end: null });
          setRoutePolyline([]);
          setStats({ distance: 0, duration: 0, speed: 0 });
        } else {
          setPoints(prev => ({ ...prev, end: newPoint }));
        }
      },
    });
    return null;
  }

  useEffect(() => {
    if (points.start && points.end) {
      fetch(`https://router.project-osrm.org/route/v1/driving/${points.start.lng},${points.start.lat};${points.end.lng},${points.end.lat}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes?.[0]) {
            const route = data.routes[0];
            setRoutePolyline(route.geometry.coordinates.map((c: any) => [c[1], c[0]]));
            setStats({
              distance: route.distance / 1000,
              duration: route.duration / 60,
              speed: (route.distance / 1000) / (route.duration / 3600)
            });
          }
        });
    }
  }, [points]);

  return (
    <div className="h-screen w-full relative bg-[#0a0a0a] font-mono overflow-hidden text-zinc-200">
      <MapContainer 
        center={[22.5726, 88.3639]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapClickHandler />
        {points.start && <Marker position={points.start} icon={DefaultIcon} />}
        {points.end && <Marker position={points.end} icon={DefaultIcon} />}
        {routePolyline.length > 0 && (
          <Polyline positions={routePolyline} pathOptions={{ color: '#22d3ee', weight: 5, opacity: 0.8 }} />
        )}
      </MapContainer>

      {/* HUD OVERLAY */}
      <div className="absolute top-6 left-6 z-[1000] w-80 pointer-events-none">
        <div className="bg-zinc-950/90 border-t-2 border-cyan-500 p-6 shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-2 mb-6">
            <Navigation size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Rider_OS v1.0</span>
          </div>
          {!points.end ? (
            <div className="text-[10px] text-zinc-500 italic">SELECT_ROUTE_COORDINATES...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase">Dist</p>
                  <p className="text-xl font-black italic">{stats.distance.toFixed(1)} KM</p>
                </div>
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase">Time</p>
                  <p className="text-xl font-black text-amber-500 italic">{Math.round(stats.duration)} MIN</p>
                </div>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800">
                <p className="text-[8px] text-zinc-500 uppercase">Target_Velocity</p>
                <p className="text-3xl font-black">{Math.round(stats.speed)} <span className="text-xs text-cyan-500">KM/H</span></p>
              </div>
            </div>
          )}
          <button onClick={() => {setPoints({start: null, end: null}); setRoutePolyline([]);}} className="w-full mt-6 py-3 border border-zinc-800 hover:border-cyan-500 text-[10px] uppercase transition-all">
            Clear_Path
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Export dynamically with SSR disabled to prevent "window is not defined"
export default dynamic(() => Promise.resolve(MapContent), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center font-mono text-cyan-500">
      INITIALIZING_RADAR_SYSTEM...
    </div>
  )
});