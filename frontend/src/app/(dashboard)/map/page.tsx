"use client";
import { useState, useRef, useEffect } from 'react';

export default function MapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{start: any, end: any}>({ start: null, end: null });
  const [routeData, setRouteData] = useState(null);

  const fetchRoute = async () => {
    // Calling FastAPI for optimized rider route
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start: points.start, end: points.end })
    });
    const data = await response.json();
    setRouteData(data.geojson);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (points.start) {
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(points.start.x || 100, points.start.y || 100, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (points.end) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(points.end.x || 400, points.end.y || 400, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      lng: -122.4 + ((e.clientX - rect.left) / rect.width) * 2,
      lat: 37.8 - ((e.clientY - rect.top) / rect.height) * 2
    };
    
    if (!points.start) {
      setPoints({ ...points, start: point });
    } else if (!points.end) {
      setPoints({ ...points, end: point });
    } else {
      setPoints({ start: point, end: null });
    }
  };

  return (
    <div className="h-screen w-full relative bg-zinc-900">
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={typeof window !== 'undefined' ? window.innerHeight : 600}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
      />
      
      <div className="absolute top-6 left-6 p-4 bg-zinc-900/90 backdrop-blur rounded-lg border border-zinc-700">
        <h2 className="text-sm font-semibold mb-2">A to B Selector</h2>
        <button onClick={fetchRoute} disabled={!points.end} className="bg-orange-500 px-4 py-2 rounded text-xs disabled:opacity-50">
          Find Route
        </button>
      </div>
    </div>
  );
}