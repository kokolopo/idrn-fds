'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLogin } from '@/lib/mockData';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const user = mockLogin(username, password);
    if (!user) {
      setError('Username atau password salah. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    localStorage.setItem('idrn_user', JSON.stringify(user));

    if (user.role === 'INSURER') {
      router.push('/dashboard');
    } else {
      router.push('/adjuster');
    }
  };

  const fillDemo = (role: 'INSURER' | 'ADJUSTER') => {
    if (role === 'INSURER') {
      setUsername('insurer');
      setPassword('insurer123');
    } else {
      setUsername('adjuster');
      setPassword('adjuster123');
    }
    setError('');
  };

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center p-4">
      {/* Floating orbs */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: '10%',
          left: '15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          bottom: '15%',
          right: '10%',
          width: 256,
          height: 256,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              boxShadow: '0 0 32px rgba(99,102,241,0.5)',
            }}
          >
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">IDRN</h1>
          <p className="mt-1 text-sm text-white/40 tracking-widest uppercase">Insurance Digital Risk Network</p>
        </div>

        {/* Card */}
        <div className="glass-card-lg rounded-3xl p-8">
          <h2 className="mb-1 text-xl font-bold text-white">Selamat Datang</h2>
          <p className="mb-8 text-sm text-white/40">Masuk ke sistem deteksi fraud asuransi kendaraan.</p>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="glass-input pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="glass-input pl-11 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="mb-3 text-center text-xs text-white/30 uppercase tracking-wider">Demo Akun</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="demo-insurer"
                onClick={() => fillDemo('INSURER')}
                className="glass-card rounded-xl px-4 py-3 text-center transition-all hover:bg-white/10 cursor-pointer"
              >
                <p className="text-xs font-bold text-cyan-300">INSURER</p>
                <p className="text-[10px] text-white/30 mt-0.5">PT Asuransi Jaya</p>
              </button>
              <button
                id="demo-adjuster"
                onClick={() => fillDemo('ADJUSTER')}
                className="glass-card rounded-xl px-4 py-3 text-center transition-all hover:bg-white/10 cursor-pointer"
              >
                <p className="text-xs font-bold text-violet-300">ADJUSTER</p>
                <p className="text-[10px] text-white/30 mt-0.5">Budi Santoso</p>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          © 2024 IDRN · Sistem Deteksi Fraud Asuransi Kendaraan
        </p>
      </div>
    </main>
  );
}
