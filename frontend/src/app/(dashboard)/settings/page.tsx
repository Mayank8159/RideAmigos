"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Save, User, Bike, AlertTriangle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function checkUserAndLoadProfile() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('full_name, bike_model')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setBikeModel(data.bike_model || '');
      }
      setLoading(false);
    }
    
    checkUserAndLoadProfile();
  }, [supabase, router]);

  // --- REFINED LOGOUT LOGIC ---
  const handleLogout = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local state if necessary
      router.refresh(); // Refresh the server components
      router.push('/login');
    } catch (error: any) {
      alert("Error logging out: " + error.message);
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        full_name: fullName,
        bike_model: bikeModel,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      alert(error.message);
    } else {
      // In a real app, use a toast notification here
      console.log('Profile calibrated.');
    }
    setActionLoading(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-orange-500 font-mono animate-pulse flex items-center gap-3">
            <Loader2 className="animate-spin" /> INITIALIZING_GARAGE_ACCESS...
        </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12 text-zinc-100 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            Garage <span className="text-orange-500 underline decoration-zinc-800 underline-offset-8">Settings</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-2 font-mono uppercase tracking-widest">Profile & Telemetry Calibration</p>
        </div>

        {!showLogoutConfirm ? (
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-xs font-bold bg-zinc-900 hover:bg-red-950/30 text-zinc-500 hover:text-red-500 px-5 py-2.5 rounded border border-zinc-800 transition-all uppercase tracking-widest"
          >
            <LogOut size={14} /> Kill Switch
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
            <span className="text-[10px] font-bold text-red-500 uppercase mr-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Confirm Logout?
            </span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-3 py-1.5 rounded font-black uppercase">Yes</button>
            <button onClick={() => setShowLogoutConfirm(false)} className="bg-zinc-800 text-zinc-300 text-[10px] px-3 py-1.5 rounded font-black uppercase">Abort</button>
          </div>
        )}
      </div>
      
      {/* Form Section */}
      <form onSubmit={handleUpdate} className="space-y-8 bg-zinc-950/50 p-8 rounded border border-zinc-800 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rotate-45 translate-x-8 -translate-y-8" />

        <div className="grid gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={14} className="text-orange-500" /> Rider Designation
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-sm focus:outline-none focus:border-orange-500 transition-colors font-mono"
              placeholder="ENTER NAME"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Bike size={14} className="text-orange-500" /> Machine Specs
            </label>
            <input 
              type="text" 
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded text-sm focus:outline-none focus:border-orange-500 transition-colors font-mono"
              placeholder="e.g. DUCATI PANIGALE V4"
              required
            />
            <div className="p-3 bg-zinc-900/30 border-l border-zinc-700 text-[10px] text-zinc-500 italic flex items-start gap-2 leading-relaxed">
              <span className="text-orange-500/50 italic font-black">NOTE:</span>
              Machine data optimizes AI-calculated service intervals and gear recommendations.
            </div>
          </div>
        </div>

        <button 
          disabled={actionLoading}
          type="submit"
          className="group w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
        >
          {actionLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          {actionLoading ? 'Syncing...' : 'Commit Changes'}
        </button>
      </form>

      {/* Footer Info */}
      <footer className="mt-12 pt-6 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
        <span>System Status: Optimal</span>
        <span>ECU Link: Encrypted</span>
      </footer>
    </div>
  );
}