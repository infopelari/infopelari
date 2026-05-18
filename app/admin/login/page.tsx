'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-bgSecondary p-8 rounded-xl border border-borderLight shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-outfit font-bold text-3xl text-white mb-2">
            INFO<span className="text-accentGreen">PELARI</span> ADMIN
          </h1>
          <p className="text-textSecondary text-sm">Masuk ke panel administrasi</p>
        </div>

        {error && (
          <div className="bg-statusDanger/20 border border-statusDanger text-statusDanger p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Email Admin</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full bg-bgTertiary border border-borderLight rounded p-3 text-white focus:outline-none focus:border-accentGreen" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded bg-accentGreen text-bgPrimary font-bold hover:bg-accentYellow transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
