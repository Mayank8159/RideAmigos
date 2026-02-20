import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/hero-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-orange-500 mb-4">
          RIDER CONNECT
        </h1>
        <p className="text-xl text-zinc-300 mb-8 max-w-lg mx-auto">
          The ultimate digital cockpit for the modern rider. Real-time rooms, 
          AI-powered maintenance, and scenic A-to-B navigation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-orange-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition">
            GET STARTED
          </Link>
          <Link href="/map" className="bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 rounded-full font-bold hover:bg-white/20 transition">
            VIEW LIVE MAP
          </Link>
        </div>
      </div>
    </div>
  );
}