'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Claim,
  User,
  DoubleClaimGroup,
  mockGetAllClaims,
  detectDoubleClaims,
  formatCurrency,
} from '@/lib/mockData';
import GlassTable from '@/components/GlassTable';
import ClaimPassport from '@/components/ClaimPassport';
import RiskBadge from '@/components/RiskBadge';
import {
  Shield,
  LogOut,
  FileText,
  AlertTriangle,
  Building2,
  Eye,
  X,
  Copy,
  TrendingUp,
  Layers,
} from 'lucide-react';

export default function RegulatorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [doubleClaimGroups, setDoubleClaimGroups] = useState<DoubleClaimGroup[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('idrn_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role !== 'REGULATOR') {
      if (parsed.role === 'INSURER') router.push('/dashboard');
      else router.push('/adjuster');
      return;
    }
    setUser(parsed);
    setAllClaims(mockGetAllClaims());
    setDoubleClaimGroups(detectDoubleClaims());
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('idrn_user');
    router.push('/');
  };

  if (!user) return null;

  const filteredClaims =
    providerFilter === 'ALL'
      ? allClaims
      : allClaims.filter((c) => c.provider === providerFilter);

  const totalClaims = allClaims.length;
  const totalDoubleClaims = doubleClaimGroups.reduce((sum, g) => sum + g.claims.length, 0);
  const providers = [...new Set(allClaims.map((c) => c.provider))];
  const avgRisk =
    allClaims.length > 0
      ? Math.round(allClaims.reduce((s, c) => s + c.riskScore, 0) / allClaims.length)
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
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                boxShadow: '0 0 16px rgba(245,158,11,0.4)',
              }}
            >
              <Shield className="text-white" style={{ height: 18, width: 18 }} />
            </div>
            <div>
              <p className="text-sm font-black text-white tracking-tight">IDRN</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Regulator Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-amber-400" />
                <p className="text-sm font-bold text-white">{user.displayName}</p>
              </div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Regulator</span>
            </div>
            <button
              id="regulator-logout"
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Regulator Overview</h1>
          <p className="mt-1 text-sm text-white/40">
            Cross-provider claim monitoring & double claim detection
          </p>
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
            <p className="text-3xl font-black text-white">{totalClaims}</p>
            <p className="mt-1 text-sm text-white/40">Total Klaim</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)' }}
              >
                <Copy className="h-5 w-5 text-rose-400" />
              </div>
              <span className="text-xs font-bold text-rose-400/60 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                Alert
              </span>
            </div>
            <p className="text-3xl font-black text-rose-400" style={{ textShadow: '0 0 16px rgba(244,63,94,0.5)' }}>
              {doubleClaimGroups.length}
            </p>
            <p className="mt-1 text-sm text-white/40">Double Claim Groups</p>
          </div>

          <div className="stat-card">
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <Layers className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400" style={{ textShadow: '0 0 16px rgba(16,185,129,0.5)' }}>
              {providers.length}
            </p>
            <p className="mt-1 text-sm text-white/40">Insurance Providers</p>
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
                color: avgRisk >= 70 ? '#f43f5e' : avgRisk >= 40 ? '#f59e0b' : '#10b981',
                textShadow: `0 0 16px ${avgRisk >= 70 ? 'rgba(244,63,94,0.5)' : avgRisk >= 40 ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.5)'}`,
              }}
            >
              {avgRisk}
            </p>
            <p className="mt-1 text-sm text-white/40">Avg Risk Score</p>
          </div>
        </div>

        {/* Double Claim Alert Panel */}
        {doubleClaimGroups.length > 0 && (
          <div className="mb-8">
            <div
              className="rounded-3xl p-6 border"
              style={{
                background: 'rgba(244,63,94,0.05)',
                borderColor: 'rgba(244,63,94,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.4)' }}
                >
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Double Claim Detected</h2>
                  <p className="text-xs text-white/40">
                    {doubleClaimGroups.length} grup klaim ganda terdeteksi lintas provider — {totalDoubleClaims} klaim terlibat
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {doubleClaimGroups.map((group) => {
                  const isExpanded = expandedGroup === group.namaPeserta;
                  return (
                    <div
                      key={group.namaPeserta}
                      className="rounded-2xl border transition-all"
                      style={{
                        background: 'rgba(244,63,94,0.06)',
                        borderColor: isExpanded ? 'rgba(244,63,94,0.4)' : 'rgba(244,63,94,0.15)',
                        boxShadow: isExpanded ? '0 0 24px rgba(244,63,94,0.15)' : 'none',
                      }}
                    >
                      {/* Group Header */}
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                        onClick={() => setExpandedGroup(isExpanded ? null : group.namaPeserta)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/30 flex-shrink-0">
                            <Copy className="h-3.5 w-3.5 text-rose-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{group.namaPeserta}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {group.providers.map((p) => (
                                <span
                                  key={p}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    p.includes('Jaya')
                                      ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
                                      : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                                  }`}
                                >
                                  {p.includes('Jaya') ? 'Asuransi Jaya' : 'Asuransi Berkah'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30">
                            {group.claims.length} klaim
                          </span>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              group.confidence === 'HIGH'
                                ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                                : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                            }`}
                          >
                            {group.confidence}
                          </span>
                        </div>
                      </button>

                      {/* Expanded: Side-by-side comparison */}
                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <div className="h-px bg-rose-500/15 mb-4" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.claims.map((claim) => (
                              <div
                                key={claim.id}
                                className="rounded-xl p-4 border border-white/10 bg-white/5 cursor-pointer hover:bg-white/8 transition-all group/card"
                                onClick={() => setSelectedClaim(claim)}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-mono font-bold text-cyan-300">{claim.id}</span>
                                  <RiskBadge status={claim.status} size="sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <p className="text-white/30 mb-0.5">Provider</p>
                                    <p className={`font-bold ${claim.provider.includes('Jaya') ? 'text-cyan-300' : 'text-emerald-300'}`}>
                                      {claim.provider.includes('Jaya') ? 'Asuransi Jaya' : 'Asuransi Berkah'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-white/30 mb-0.5">No. Klaim</p>
                                    <p className="font-semibold text-white font-mono">{claim.nomorKlaim}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/30 mb-0.5">Nilai Klaim</p>
                                    <p className="font-bold text-violet-300">{formatCurrency(claim.nilaiKlaimDiajukan)}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/30 mb-0.5">Date of Loss</p>
                                    <p className="font-semibold text-white">{claim.dateOfLoss}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/30 mb-0.5">Bengkel</p>
                                    <p className="font-semibold text-white">{claim.bengkelRekenan}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/30 mb-0.5">Risk Score</p>
                                    <p
                                      className="font-black"
                                      style={{
                                        color: claim.riskScore >= 70 ? '#f43f5e' : claim.riskScore >= 40 ? '#f59e0b' : '#10b981',
                                      }}
                                    >
                                      {claim.riskScore}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center justify-end">
                                  <span className="text-[10px] text-white/30 group-hover/card:text-white/60 flex items-center gap-1 transition-colors">
                                    <Eye className="h-3 w-3" /> Detail
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* All Claims Table */}
        <div className="glass-card-lg rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Semua Klaim</h2>
              <p className="text-sm text-white/40">{filteredClaims.length} klaim ditemukan</p>
            </div>

            {/* Provider Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProviderFilter('ALL')}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  providerFilter === 'ALL'
                    ? 'text-white bg-white/10 border-white/30'
                    : 'text-white/40 border-white/10 hover:text-white/70 hover:border-white/20'
                }`}
              >
                Semua
              </button>
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => setProviderFilter(p)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    providerFilter === p
                      ? p.includes('Jaya')
                        ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                        : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                      : 'text-white/40 border-white/10 hover:text-white/70 hover:border-white/20'
                  }`}
                >
                  {p.includes('Jaya') ? 'Asuransi Jaya' : 'Asuransi Berkah'}
                </button>
              ))}
            </div>
          </div>

          <GlassTable
            claims={filteredClaims}
            onRowClick={(claim) => setSelectedClaim(claim)}
            showProvider={true}
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
              id="close-regulator-modal"
              onClick={() => setSelectedClaim(null)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Provider badge */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedClaim.provider.includes('Jaya')
                    ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
                    : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                }`}
              >
                {selectedClaim.provider}
              </span>
            </div>

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
