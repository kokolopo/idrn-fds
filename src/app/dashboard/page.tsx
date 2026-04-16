'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Claim, mockGetClaims, User } from '@/lib/mockData';
import GlassTable from '@/components/GlassTable';
import RiskBadge from '@/components/RiskBadge';
import ClaimPassport from '@/components/ClaimPassport';
import {
  Shield,
  LogOut,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  X,
  Building2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('idrn_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role !== 'INSURER') {
      router.push('/adjuster');
      return;
    }
    setUser(parsed);
    setClaims(mockGetClaims());
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('idrn_user');
    router.push('/');
  };

  if (!user) return null;

  const total = claims.length;
  const fraudDetected = claims.filter(
    (c) => c.status === 'REJECTED' || c.riskScore >= 70
  ).length;
  const pending = claims.filter((c) => c.status === 'PENDING').length;
  const avgRiskScore =
    claims.length > 0
      ? Math.round(claims.reduce((sum, c) => sum + c.riskScore, 0) / claims.length)
      : 0;

  return (
    <div className="mesh-bg min-h-screen">
      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 border-b border-white/10"
        style={{
          background: 'rgba(6, 9, 24, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
            >
              <Shield className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">IDRN</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Insurance Digital Risk Network</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-cyan-400" />
                <p className="text-sm font-bold text-white">{user.displayName}</p>
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Insurer</span>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/40">Monitoring klaim dan deteksi fraud asuransi kendaraan</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.3)' }}
              >
                <FileText className="h-5 w-5 text-sky-400" />
              </div>
              <TrendingUp className="h-4 w-4 text-white/20" />
            </div>
            <p className="text-3xl font-black text-white">{total}</p>
            <p className="mt-1 text-sm text-white/40">Total Claims</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}
              >
                <AlertTriangle className="h-5 w-5 text-rose-400" />
              </div>
              <span className="text-xs font-bold text-rose-400/60 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                High Risk
              </span>
            </div>
            <p className="text-3xl font-black text-rose-400" style={{ textShadow: '0 0 16px rgba(244,63,94,0.5)' }}>
              {fraudDetected}
            </p>
            <p className="mt-1 text-sm text-white/40">Fraud Detected</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <RiskBadge status="PENDING" size="sm" />
            </div>
            <p className="text-3xl font-black text-amber-400" style={{ textShadow: '0 0 16px rgba(245,158,11,0.5)' }}>
              {pending}
            </p>
            <p className="mt-1 text-sm text-white/40">Pending Review</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                <Shield className="h-5 w-5 text-violet-400" />
              </div>
            </div>
            <p
              className="text-3xl font-black"
              style={{
                color: avgRiskScore >= 70 ? '#f43f5e' : avgRiskScore >= 40 ? '#f59e0b' : '#10b981',
                textShadow: `0 0 16px ${avgRiskScore >= 70 ? 'rgba(244,63,94,0.5)' : avgRiskScore >= 40 ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.5)'}`,
              }}
            >
              {avgRiskScore}
            </p>
            <p className="mt-1 text-sm text-white/40">Avg Risk Score</p>
          </div>
        </div>

        {/* Claims Table */}
        <div className="glass-card-lg rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Daftar Klaim</h2>
              <p className="text-sm text-white/40">{total} klaim ditemukan</p>
            </div>
          </div>
          <GlassTable
            claims={claims}
            onRowClick={(claim) => setSelectedClaim(claim)}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedClaim && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedClaim(null)}
        >
          <div className="relative w-full max-w-md">
            <button
              id="close-detail-modal"
              onClick={() => setSelectedClaim(null)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <ClaimPassport claim={selectedClaim} />

            {/* Audit Log */}
            <div className="mt-4 glass-card rounded-2xl p-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Audit Log</p>
              <div className="flex flex-col gap-2">
                {selectedClaim.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="flex flex-col items-center mt-1">
                      <div className="h-2 w-2 rounded-full bg-cyan-400/60 flex-shrink-0" />
                      {i < selectedClaim.auditLog.length - 1 && (
                        <div className="w-px flex-1 min-h-3 bg-white/10 mt-1" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-white/70">{log.action}</span>
                      <span className="text-white/30"> · {log.user}</span>
                      <p className="text-white/30 mt-0.5">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </p>
                      {log.justification && (
                        <p className="text-white/50 mt-1 italic">"{log.justification}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
