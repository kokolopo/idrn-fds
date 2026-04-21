'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Claim,
  User,
  Policy,
  mockGetPoliciesByNasabah,
  mockGetClaimsByNasabah,
  formatCurrency,
  CLAIM_STAGE_ORDER,
  CLAIM_STAGE_LABELS,
  POLICY_STATUS_LABELS,
  ClaimStage,
  PolicyStatus,
} from '@/lib/mockData';
import ClaimPassport from '@/components/ClaimPassport';
import RiskBadge from '@/components/RiskBadge';
import {
  Shield,
  LogOut,
  FileText,
  X,
  User as UserIcon,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from 'lucide-react';

// Policy status color config
const policyStatusConfig: Record<PolicyStatus, { color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  IN_FORCE: { color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: CheckCircle2 },
  LAPSE: { color: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/30', icon: XCircle },
  REINSTATEMENT: { color: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: RotateCcw },
  TERMINATED: { color: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/15', icon: AlertTriangle },
};

function ClaimStageStepper({ currentStage }: { currentStage: ClaimStage }) {
  const currentIdx = CLAIM_STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="flex items-center w-full gap-0">
      {CLAIM_STAGE_ORDER.map((stage, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center relative" style={{ minWidth: 24 }}>
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all flex-shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300'
                    : isCurrent
                    ? 'border-2 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-2 border-white/15 text-white/20'
                }`}
                style={
                  isCurrent
                    ? {
                        background: 'rgba(6,182,212,0.2)',
                        boxShadow: '0 0 12px rgba(6,182,212,0.4), 0 0 24px rgba(6,182,212,0.15)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }
                    : {}
                }
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <p
                className={`text-[9px] mt-1.5 text-center leading-tight whitespace-nowrap ${
                  isCompleted ? 'text-emerald-400/70' : isCurrent ? 'text-cyan-300 font-bold' : 'text-white/20'
                }`}
              >
                {CLAIM_STAGE_LABELS[stage]}
              </p>
            </div>

            {/* Connector line */}
            {idx < CLAIM_STAGE_ORDER.length - 1 && (
              <div className="flex-1 mx-1">
                <div
                  className={`h-0.5 w-full rounded-full ${
                    isCompleted ? 'bg-emerald-500/40' : 'bg-white/8'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NasabahPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('idrn_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role !== 'NASABAH') {
      if (parsed.role === 'INSURER') router.push('/dashboard');
      else if (parsed.role === 'REGULATOR') router.push('/regulator');
      else router.push('/adjuster');
      return;
    }
    setUser(parsed);

    if (parsed.linkedNasabah) {
      setPolicies(mockGetPoliciesByNasabah(parsed.linkedNasabah));
      setClaims(mockGetClaimsByNasabah(parsed.linkedNasabah));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('idrn_user');
    router.push('/');
  };

  if (!user) return null;

  const isInstitusi = user.company !== 'Perorangan';
  const activePolices = policies.filter(p => p.statusPolis === 'IN_FORCE').length;

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
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                boxShadow: '0 0 16px rgba(236,72,153,0.4)',
              }}
            >
              <Shield className="text-white" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">IDRN</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Nasabah Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                {isInstitusi ? (
                  <Building2 className="h-3 w-3 text-pink-400" />
                ) : (
                  <UserIcon className="h-3 w-3 text-pink-400" />
                )}
                <p className="text-sm font-bold text-white">{user.displayName}</p>
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                {isInstitusi ? 'Institusi' : 'Perorangan'}
              </span>
            </div>
            <button
              id="nasabah-logout"
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
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">
            Selamat Datang, {user.displayName}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Pantau status polis dan progress klaim Anda
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.3)' }}
              >
                <FileText className="h-5 w-5 text-sky-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{policies.length}</p>
            <p className="mt-1 text-sm text-white/40">Total Polis</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400" style={{ textShadow: '0 0 16px rgba(16,185,129,0.5)' }}>
              {activePolices}
            </p>
            <p className="mt-1 text-sm text-white/40">Polis Aktif</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-400" style={{ textShadow: '0 0 16px rgba(245,158,11,0.5)' }}>
              {claims.length}
            </p>
            <p className="mt-1 text-sm text-white/40">Total Klaim</p>
          </div>
        </div>

        {/* Policy Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Status Polis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => {
              const cfg = policyStatusConfig[policy.statusPolis];
              const StatusIcon = cfg.icon;
              const linkedClaims = claims.filter(c => policy.claimIds.includes(c.id));

              return (
                <div
                  key={`${policy.noPolis}-${policy.provider}`}
                  className={`glass-card rounded-2xl p-5 border ${cfg.border} transition-all`}
                >
                  {/* Policy header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/30 font-mono mb-1">{policy.noPolis}</p>
                      <p className="text-sm font-bold text-white">{policy.namaPeserta}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.border} border ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {POLICY_STATUS_LABELS[policy.statusPolis]}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          policy.tipePeserta === 'INSTITUSI'
                            ? 'text-violet-300 bg-violet-500/10 border-violet-500/25'
                            : 'text-pink-300 bg-pink-500/10 border-pink-500/25'
                        }`}
                      >
                        {policy.tipePeserta}
                      </span>
                    </div>
                  </div>

                  {/* Policy details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Provider</p>
                      <p className={`text-xs font-bold mt-0.5 ${policy.provider.includes('Jaya') ? 'text-cyan-300' : 'text-emerald-300'}`}>
                        {policy.provider.includes('Jaya') ? 'Asuransi Jaya' : 'Asuransi Berkah'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Klaim Terkait</p>
                      <p className="text-xs font-bold text-white mt-0.5">{linkedClaims.length} klaim</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Periode Mulai</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{policy.periodeAwal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Periode Akhir</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{policy.periodeAkhir}</p>
                    </div>
                  </div>

                  {/* Linked claims mini list */}
                  {linkedClaims.length > 0 && (
                    <div className="border-t border-white/8 pt-3">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Klaim pada Polis Ini</p>
                      {linkedClaims.map(cl => (
                        <button
                          key={cl.id}
                          onClick={() => setSelectedClaim(cl)}
                          className="w-full flex items-center justify-between rounded-lg px-3 py-2 bg-white/3 hover:bg-white/8 border border-white/5 transition-all cursor-pointer mb-1.5 last:mb-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-cyan-300">{cl.id}</span>
                            <RiskBadge status={cl.status} size="sm" />
                          </div>
                          <span className="text-[10px] text-white/40">{formatCurrency(cl.nilaiKlaimDiajukan)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim Progress Tracking */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Progress Klaim</h2>

          {claims.length === 0 ? (
            <div className="glass-card-lg rounded-3xl p-12 text-center">
              <FileText className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">Belum ada klaim yang diajukan.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="glass-card rounded-2xl p-5 cursor-pointer transition-all hover:bg-white/5"
                  onClick={() => setSelectedClaim(claim)}
                >
                  {/* Claim info header */}
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-cyan-300">{claim.id}</span>
                      <RiskBadge status={claim.status} size="sm" />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          claim.provider.includes('Jaya')
                            ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
                            : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                        }`}
                      >
                        {claim.provider.includes('Jaya') ? 'Asuransi Jaya' : 'Asuransi Berkah'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-violet-300">
                      {formatCurrency(claim.nilaiKlaimDiajukan)}
                    </span>
                  </div>

                  {/* Stage stepper */}
                  <div className="mb-4 px-2">
                    <ClaimStageStepper currentStage={claim.claimStage} />
                  </div>

                  {/* Claim quick details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/8">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">No. Klaim</p>
                      <p className="text-xs font-mono font-semibold text-white mt-0.5">{claim.nomorKlaim}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Date of Loss</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{claim.dateOfLoss}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Bengkel</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{claim.bengkelRekenan}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Stage</p>
                      <p className="text-xs font-bold text-cyan-300 mt-0.5">
                        {CLAIM_STAGE_LABELS[claim.claimStage]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedClaim(null)}
        >
          <div className="relative w-full max-w-md">
            <button
              id="close-nasabah-modal"
              onClick={() => setSelectedClaim(null)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Stage stepper in modal */}
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4">Progress Klaim</p>
              <ClaimStageStepper currentStage={selectedClaim.claimStage} />
            </div>

            <ClaimPassport claim={selectedClaim} />

            {/* Audit Log */}
            <div className="mt-4 glass-card rounded-2xl p-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Riwayat Aktivitas</p>
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
                        <p className="text-white/50 mt-1 italic">&quot;{log.justification}&quot;</p>
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
