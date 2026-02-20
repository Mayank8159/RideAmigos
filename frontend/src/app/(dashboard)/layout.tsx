"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Users, Bot, Settings, Zap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/map', icon: Map, label: 'Tactical Map' },
    { href: '/room/global', icon: Users, label: 'Squad' },
    { href: '/assistant', icon: Bot, label: 'MotoAI' },
    { href: '/settings', icon: Settings, label: 'Garage' },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <nav className="hidden md:flex w-20 flex-col items-center py-8 bg-zinc-950 border-r border-zinc-900 z-50">
        <div className="mb-12">
          <Zap className="text-orange-500 fill-orange-500 animate-pulse" size={28} />
        </div>
        
        <div className="flex flex-col gap-10">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`relative group p-3 rounded-xl transition-all duration-300 ${
                isActive(item.href) 
                ? 'text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive(item.href) ? 2.5 : 1.5} />
              
              {/* Desktop Tooltip */}
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-zinc-700">
                {item.label}
              </span>

              {/* Active Indicator Glow */}
              {isActive(item.href) && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full shadow-[2px_0_10px_rgba(249,115,22,0.5)]" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 flex items-center justify-around px-4 z-[1000]">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              isActive(item.href) ? 'text-orange-500' : 'text-zinc-600'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.href) ? 2.5 : 1.5} />
            <span className="text-[8px] font-black uppercase tracking-tighter">
              {item.label.split(' ')[0]}
            </span>
          </Link>
        ))}
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Subtle Scanline/Grid Overlay for the whole dashboard */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <section className="flex-1 relative z-10 overflow-y-auto pb-16 md:pb-0 scrollbar-hide">
          {children}
        </section>
      </main>
    </div>
  );
}