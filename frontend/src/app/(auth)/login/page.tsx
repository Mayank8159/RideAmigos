"use client";
import { useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/map');
    else alert(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold mb-4">Rider Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-zinc-800 p-2 rounded border border-zinc-700" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-zinc-800 p-2 rounded border border-zinc-700" />
        <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded font-bold transition">Ride On</button>
      </form>
    </div>
  );
}