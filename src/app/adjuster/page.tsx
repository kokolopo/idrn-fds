'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Claim,
  User,
  mockGetPendingClaims,
  mockUpdateClaimStatus,
  formatCurrency,
} from '@/lib/mockData';
import ClaimPassport from '@/components/ClaimPassport';
import RiskBadge from '@/components/RiskBadge';
import {
  Shield,
  LogOut,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Clock,
  AlertTriangle,
  X,
  MessageSquare,
  User as UserIcon,
  Loader2,
} from 'lucide-react';

export default function AdjusterPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [justification, setJustification] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('idrn_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role !== 'ADJUSTER') {
      router.push('/dashboard');
      return;
    }
    setUser(parsed);
    setClaims(mockGetPendingClaims());
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('idrn_user');
    router.push('/');
  };

  const handleAction = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selectedClaim || !user) return;
    if (!justification.trim()) {
      setErrorMsg('Justification wajib diisi sebelum memberikan keputusan.');
      return;
    }

    setActionLoading(true);
    setErrorMsg('');
    await new Promise((r) => setTimeout(r, 1000));

    mockUpdateClaimStatus(selectedClaim.id, action, user.displayName, justification.trim());

    setSuccessMsg(
      action === 'APPROVED'
        ? `Klaim ${selectedClaim.id} berhasil di-APPROVE.`
        : `Klaim ${selectedClaim.id} berhasil di-REJECT.`
    );
    setClaims(mockGetPendingClaims());
    setSelectedClaim(null);
    setJustification('');
    setActionLoading(false);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!user) return null;

  const triggeredRulesCount = selectedClaim?.fraudRules.filter((r) => r.triggered).length ?? 0;

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
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 0 16px rgba(139,92,246,0.4)',
              }}
            >
              <Shield className="text-white" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">IDRN</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Adjuster Queue</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <UserIcon className="h-3 w-3 text-violet-400" />
                <p className="text-sm font-bold text-white">{user.displayName}</p>
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Adjuster</span>
            </div>
            <button id="adjuster-logout" onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Success toast */}
        {successMsg && (
          <div
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 px-5 py-4"
            style={{ background: 'rgba(16,185,129,0.12)', backdropFilter: 'blur(12px)' }}
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-300">{successMsg}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Antrian Klaim</h1>
            <p className="mt-1 text-sm text-white/40">
              {claims.length} klaim menunggu persetujuan
            </p>
          </div>
          <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">{claims.length} Pending</span>
          </div>
        </div>

        {/* Claim list */}
        {claims.length === 0 ? (
          <div className="glass-card-lg rounded-3xl p-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-bold text-white/60">Semua klaim telah diproses</p>
            <p className="text-sm text-white/30 mt-2">Tidak ada klaim yang menunggu review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {claims.map((claim) => {
              const triggered = claim.fraudRules.filter((r) => r.triggered).length;
              return (
                <div
                  key={claim.id}
                  id={`claim-card-${claim.id}`}
                  className="glass-card rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all hover:bg-white/10 group"
                  onClick={() => {
                    setSelectedClaim(claim);
                    setJustification('');
                    setErrorMsg('');
                  }}
                >
                  {/* Risk score */}
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black"
                    style={{
                      background:
                        claim.riskScore >= 70
                          ? 'rgba(244,63,94,0.2)'
                          : claim.riskScore >= 40
                          ? 'rgba(245,158,11,0.2)'
                          : 'rgba(16,185,129,0.2)',
                      border: `1px solid ${claim.riskScore >= 70 ? 'rgba(244,63,94,0.4)' : claim.riskScore >= 40 ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`,
                      color:
                        claim.riskScore >= 70
                          ? '#f43f5e'
                          : claim.riskScore >= 40
                          ? '#f59e0b'
                          : '#10b981',
                      textShadow:
                        claim.riskScore >= 70
                          ? '0 0 12px rgba(244,63,94,0.6)'
                          : claim.riskScore >= 40
                          ? '0 0 12px rgba(245,158,11,0.6)'
                          : '0 0 12px rgba(16,185,129,0.6)',
                    }}
                  >
                    {claim.riskScore}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-cyan-300 font-mono">{claim.nomorKlaim}</span>
                      {triggered > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {triggered} rule
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{claim.namaPeserta}</p>
                    <p className="text-xs text-white/40 truncate">{claim.noPolis} · {claim.bengkelRekenan}</p>
                    <p className="text-xs text-violet-300 font-semibold mt-1">{formatCurrency(claim.nilaiKlaimDiajukan)}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail + Action Modal */}
      {selectedClaim && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedClaim(null)}
        >
          <div className="relative w-full max-w-md">
            <button
              id="close-adjuster-modal"
              onClick={() => setSelectedClaim(null)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Claim Passport */}
            <ClaimPassport claim={selectedClaim} />

            {/* Audit Log */}
            {selectedClaim.auditLog.length > 0 && (
              <div className="mt-4 glass-card rounded-2xl p-5">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Audit Log</p>
                <div className="flex flex-col gap-2">
                  {selectedClaim.auditLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="flex flex-col items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-cyan-400/60" />
                        {i < selectedClaim.auditLog.length - 1 && (
                          <div className="w-px min-h-3 bg-white/10 mt-1" style={{ height: 12 }} />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white/70">{log.action}</span>
                        <span className="text-white/30"> · {log.user}</span>
                        <p className="text-white/30">{new Date(log.timestamp).toLocaleString('id-ID')}</p>
                        {log.justification && (
                          <p className="text-white/50 italic mt-0.5">"{log.justification}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Form */}
            <div className="mt-4 glass-card-lg rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <p className="text-sm font-bold text-white">Keputusan Adjuster</p>
              </div>

              {/* Fraud warning */}
              {triggeredRulesCount > 0 && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-300">Peringatan Fraud Terdeteksi</p>
                    <p className="text-xs text-rose-200/70 mt-0.5">
                      {triggeredRulesCount} rule fraud telah terpicu pada klaim ini. Pastikan justifikasi
                      penolakan sudah lengkap jika klaim akan di-reject.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                  <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <p className="text-xs text-rose-300">{errorMsg}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Justification <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="adjuster-justification"
                  value={justification}
                  onChange={(e) => {
                    setJustification(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Masukkan alasan dan justifikasi keputusan Anda..."
                  rows={4}
                  className="glass-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-approve"
                  onClick={() => handleAction('APPROVED')}
                  disabled={actionLoading}
                  className="btn-approve flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Approve
                </button>
                <button
                  id="btn-reject"
                  onClick={() => handleAction('REJECTED')}
                  disabled={actionLoading}
                  className="btn-reject flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
