'use client';

import { ClaimStatus } from '@/lib/mockData';

interface RiskBadgeProps {
  status: ClaimStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-300',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    dot: 'bg-emerald-400',
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/50',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    dot: 'bg-amber-400',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/50',
    text: 'text-rose-300',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]',
    dot: 'bg-rose-400',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function RiskBadge({ status, size = 'md' }: RiskBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}
