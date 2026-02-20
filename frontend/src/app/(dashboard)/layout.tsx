import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <nav className="w-20 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-8 gap-8">
        <Link href="/map" className="hover:text-orange-500 transition">📍</Link>
        <Link href="/room/global" className="hover:text-orange-500 transition">👥</Link>
        <Link href="/assistant" className="hover:text-orange-500 transition">🤖</Link>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-zinc-950">
        {children}
      </main>
    </div>
  );
}