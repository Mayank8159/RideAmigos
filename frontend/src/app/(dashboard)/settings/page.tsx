"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [bikeModel, setBikeModel] = useState('');

  useEffect(() => {
    async function checkUserAndLoadProfile() {
      // 1. Check if user is even logged in
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        // If no user, kick them to the login page
        router.push('/login');
        return;
      }

      // 2. Load existing profile data
      const { data, error } = await supabase
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      alert('Profile updated! Your AI assistant is now calibrated.');
    }
    setLoading(false);
  };

  // 3. Added Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="p-8 text-white">Revving engines...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-500">Garage Settings</h1>
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="text-sm bg-zinc-800 hover:bg-red-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg transition border border-zinc-700"
        >
          Logout
        </button>
      </div>
      
      <form onSubmit={handleUpdate} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-sm font-medium mb-2">Rider Name</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-orange-500"
            placeholder="e.g. Valentino Rossi"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">My Bike (Model & Year)</label>
          <input 
            type="text" 
            value={bikeModel}
            onChange={(e) => setBikeModel(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-orange-500"
            placeholder="e.g. 2023 Yamaha YZF-R1"
            required
          />
          <p className="text-xs text-zinc-500 mt-2 italic">
            This helps the AI give you specific maintenance and part advice.
          </p>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Garage'}
        </button>
      </form>
    </div>
  );
}