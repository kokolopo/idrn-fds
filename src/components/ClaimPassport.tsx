'use client';

import { Claim, formatCurrency } from '@/lib/mockData';
import RiskBadge from './RiskBadge';
import { Shield, Hash, Wrench, Calendar, AlertTriangle, CheckCircle, XCircle, FileText, Clock, ClipboardCheck } from 'lucide-react';

interface ClaimPassportProps {
  claim: Claim;
}

function CircularProgress({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 70
      ? '#f43f5e'
      : score >= 40
      ? '#f59e0b'
      : '#10b981';

  const glowColor =
    score >= 70
      ? 'rgba(244,63,94,0.6)'
      : score >= 40
      ? 'rgba(245,158,11,0.6)'
      : 'rgba(16,185,129,0.6)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="-rotate-90">
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          strokeWidth="10"
          stroke="rgba(255,255,255,0.08)"
        />
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          strokeWidth="10"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
            transition: 'stroke-dashoffset 1s ease',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-white/50 tracking-widest uppercase">Risk</span>
      </div>
    </div>
  );
}

export default function ClaimPassport({ claim }: ClaimPassportProps) {
  const triggeredRules = claim.fraudRules.filter(r => r.triggered);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Claim Passport</span>
        </div>
        <RiskBadge status={claim.status} size="sm" />
      </div>

      {/* Nama & Score */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-black text-white leading-tight">{claim.namaPeserta}</p>
          <p className="text-xs text-cyan-400/80 font-mono mt-1">{claim.nomorKlaim}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full">
              {claim.causeOfLoss}
            </span>
            <span className="text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
              {claim.bengkelRekenan}
            </span>
          </div>
        </div>
        <CircularProgress score={claim.riskScore} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Grid detail utama */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">No. Polis</p>
          <p className="text-xs font-bold text-white font-mono">{claim.noPolis}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Nilai Klaim Diajukan</p>
          <p className="text-sm font-bold text-cyan-300">{formatCurrency(claim.nilaiKlaimDiajukan)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Periode Polis Awal</p>
          <p className="text-xs font-semibold text-white">{claim.periodePolisAwal}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Periode Polis Akhir</p>
          <p className="text-xs font-semibold text-white">{claim.periodePolisAkhir}</p>
        </div>
      </div>

      {/* Date of Loss */}
      <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/8">
        <Calendar className="h-4 w-4 text-rose-400 flex-shrink-0" />
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Date Of Loss</p>
          <p className="text-sm font-bold text-white">{claim.dateOfLoss}</p>
        </div>
      </div>

      {/* Timeline dokumen */}
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          Timeline Dokumen
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Informasi Awal', value: claim.tglInformasiAwal, icon: FileText },
            { label: 'Dok. Diterima', value: claim.tglDokDiterima, icon: ClipboardCheck },
            { label: 'Dok. Lengkap', value: claim.tglDokLengkap, icon: ClipboardCheck },
            { label: 'SK Cabang', value: claim.suratKeputusanCabang, icon: Wrench },
          ].map((item, idx, arr) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="h-5 w-5 rounded-full flex items-center justify-center bg-cyan-500/20 border border-cyan-500/30 flex-shrink-0">
                  <item.icon className="h-2.5 w-2.5 text-cyan-400" />
                </div>
                {idx < arr.length - 1 && <div className="w-px flex-1 bg-white/10 mt-0.5" style={{ minHeight: 8 }} />}
              </div>
              <div className="flex items-center justify-between flex-1 pb-1">
                <p className="text-xs text-white/40">{item.label}</p>
                <p className="text-xs font-semibold text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHA-256 Hash */}
      <div className="bg-black/30 rounded-xl p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-3.5 w-3.5 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">SHA-256 Hash</span>
        </div>
        <p className="text-xs font-mono text-cyan-400/70 break-all leading-relaxed">{claim.sha256Hash}</p>
      </div>

      {/* Fraud Rules */}
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Fraud Detection Rules</p>
        <div className="flex flex-col gap-2">
          {claim.fraudRules.map((rule) => (
            <div
              key={rule.code}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                rule.triggered
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {rule.triggered ? (
                <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-4 w-4 text-emerald-500/60 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold ${rule.triggered ? 'text-rose-400' : 'text-white/40'}`}>
                    {rule.code}
                  </span>
                  <span className={`text-xs font-semibold ${rule.triggered ? 'text-rose-200' : 'text-white/50'}`}>
                    {rule.name}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${rule.triggered ? 'text-rose-200/70' : 'text-white/30'}`}>
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triggered summary */}
      {triggeredRules.length > 0 && (
        <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 rounded-xl p-3">
          <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
          <p className="text-xs text-rose-200">
            <strong>{triggeredRules.length} rule fraud terpicu.</strong> Klaim ini membutuhkan investigasi lebih lanjut.
          </p>
        </div>
      )}
    </div>
  );
}
