"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // 1. Maintain State: Redirect if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/map');
    };
    checkUser();
  }, [router, supabase]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clean input to prevent "400 Bad Request" due to accidental spaces
    const cleanEmail = email.trim();

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const { error } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });
      
      if (!error) {
        router.push('/map');
      } else {
        alert(`Authentication Failed: ${error.message}`);
      }
    } else {
      // --- REGISTER LOGIC ---
      const { data, error } = await supabase.auth.signUp({ 
        email: cleanEmail, 
        password 
      });

      if (error) {
        alert(`Registration Failed: ${error.message}`);
      } else {
        // If Supabase "Confirm Email" is OFF, data.session will exist immediately
        if (data.session) {
          router.push('/map');
        } else {
          alert("Welcome to the crew! Please check your email to confirm your account.");
          setIsLogin(true);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-12 h-full bg-orange-600/10 -skew-x-12 transform pointer-events-none"></div>
      <div className="absolute top-0 left-1/3 w-4 h-full bg-orange-600/5 -skew-x-12 transform pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
            RIDE<span className="text-orange-500">AMIGOS</span>
          </h1>
          <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs mt-2">
            {isLogin ? "Authorized Personnel Only" : "Join the Syndicate"}
          </p>
        </div>

        <div className="bg-zinc-900 border-t-4 border-orange-500 rounded-xl shadow-2xl overflow-hidden shadow-orange-900/20">
          <form onSubmit={handleAuth} className="p-8 flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Throttle Up" : "Create Account"}
            </h2>

            <div className="space-y-4">
              <div className="group">
                <label className="text-xs uppercase font-bold text-zinc-500 group-focus-within:text-orange-500 transition-colors">Email Address</label>
                <input 
                  type="email" 
                  placeholder="rider@track.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-zinc-800 p-3 mt-1 rounded border border-zinc-700 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>

              <div className="group">
                <label className="text-xs uppercase font-bold text-zinc-500 group-focus-within:text-orange-500 transition-colors">Passcode</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-zinc-800 p-3 mt-1 rounded border border-zinc-700 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="mt-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-black py-4 rounded uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? "Ignition..." : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="bg-zinc-800/50 p-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm">
              {isLogin ? "New to the crew?" : "Already a member?"}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-orange-500 font-bold hover:underline underline-offset-4"
              >
                {isLogin ? "Sign Up Now" : "Back to Login"}
              </button>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-zinc-600 text-[10px] uppercase tracking-tighter">
          Powered by High-Octane Coffee & Carbon Fiber
        </p>
      </div>
    </div>
  );
}