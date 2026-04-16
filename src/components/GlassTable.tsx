'use client';

import { ReactNode, useState } from 'react';
import { Claim, formatCurrency } from '@/lib/mockData';
import RiskBadge from './RiskBadge';
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface GlassTableProps {
  claims: Claim[];
  onRowClick?: (claim: Claim) => void;
  itemsPerPage?: number;
}

const columns: Column<Claim>[] = [
  {
    key: 'namaPeserta',
    header: 'Nama Peserta',
    render: (claim) => (
      <div>
        <p className="text-sm font-semibold text-white whitespace-nowrap">{claim.namaPeserta}</p>
        <p className="text-xs text-white/40 font-mono mt-0.5">{claim.noPolis}</p>
      </div>
    ),
  },
  {
    key: 'nomorKlaim',
    header: 'No. Klaim',
    render: (claim) => (
      <span className="font-mono text-xs font-bold text-cyan-300">{claim.nomorKlaim}</span>
    ),
  },
  {
    key: 'periode',
    header: 'Periode Polis',
    render: (claim) => (
      <div className="text-xs text-white/60 whitespace-nowrap">
        <p>{claim.periodePolisAwal}</p>
        <p className="text-white/30">s/d {claim.periodePolisAkhir}</p>
      </div>
    ),
  },
  {
    key: 'bengkel',
    header: 'Bengkel',
    render: (claim) => (
      <span className="text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
        {claim.bengkelRekenan}
      </span>
    ),
  },
  {
    key: 'nilaiKlaim',
    header: 'Nilai Klaim',
    render: (claim) => (
      <span className="text-sm font-semibold text-violet-300 whitespace-nowrap">
        {formatCurrency(claim.nilaiKlaimDiajukan)}
      </span>
    ),
  },
  {
    key: 'dateOfLoss',
    header: 'Date of Loss',
    render: (claim) => (
      <div>
        <p className="text-xs font-semibold text-white whitespace-nowrap">{claim.dateOfLoss}</p>
        <p className="text-[10px] text-amber-400/80 mt-0.5">{claim.causeOfLoss}</p>
      </div>
    ),
  },
  {
    key: 'riskScore',
    header: 'Risk Score',
    render: (claim) => {
      const color =
        claim.riskScore >= 70
          ? 'text-rose-400'
          : claim.riskScore >= 40
          ? 'text-amber-400'
          : 'text-emerald-400';
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
            <div
              className={`h-full rounded-full ${
                claim.riskScore >= 70 ? 'bg-rose-500' : claim.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${claim.riskScore}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${color}`}>{claim.riskScore}</span>
        </div>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    render: (claim) => <RiskBadge status={claim.status} size="sm" />,
  },
];

export default function GlassTable({ claims, onRowClick, itemsPerPage = 5 }: GlassTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(claims.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginated = claims.slice(startIndex, startIndex + itemsPerPage);

  const goTo = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Generate page number buttons (show at most 5 page numbers)
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="rounded-t-2xl overflow-hidden border border-white/10 border-b-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-white/5 backdrop-blur-md border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-4 text-left text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => onRowClick?.(claim)}
                  className={`group transition-all duration-200 border-b border-white/5 last:border-0 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } hover:bg-white/5`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col.render(claim)}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right">
                    {onRowClick && (
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors ml-auto" />
                    )}
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-white/30 text-sm">
                    Tidak ada data klaim.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div
        className="rounded-b-2xl border border-white/10 flex items-center justify-between px-5 py-3.5 gap-4 flex-wrap"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
      >
        {/* Info */}
        <p className="text-xs text-white/30 whitespace-nowrap">
          Menampilkan{' '}
          <span className="font-semibold text-white/60">
            {claims.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, claims.length)}
          </span>{' '}
          dari <span className="font-semibold text-white/60">{claims.length}</span> klaim
        </p>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* First */}
          <button
            onClick={() => goTo(1)}
            disabled={safePage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman pertama"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Prev */}
          <button
            onClick={() => goTo(safePage - 1)}
            disabled={safePage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-white/20 text-sm select-none">
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goTo(page as number)}
                className={`flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  page === safePage
                    ? 'text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/10'
                }`}
                style={
                  page === safePage
                    ? {
                        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                        boxShadow: '0 0 12px rgba(99,102,241,0.4)',
                      }
                    : {}
                }
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goTo(safePage + 1)}
            disabled={safePage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last */}
          <button
            onClick={() => goTo(totalPages)}
            disabled={safePage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman terakhir"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
