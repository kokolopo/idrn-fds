export type ClaimStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type UserRole = 'INSURER' | 'ADJUSTER';

export interface FraudRule {
  code: string;
  name: string;
  description: string;
  triggered: boolean;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
  justification?: string;
}

export interface Claim {
  // Identitas
  id: string;                      // internal ID
  nomorKlaim: string;              // Nomor Klaim
  noPolis: string;                 // No Polis
  namaPeserta: string;             // Nama Peserta
  // Periode polis
  periodePolisAwal: string;        // Periode Polis Awal
  periodePolisAkhir: string;       // Periode Polis Akhir
  // Workshop & klaim
  bengkelRekenan: string;          // Bengkel rekenan
  nilaiKlaimDiajukan: number;      // Nilai Klaim diajukan
  // Kejadian
  dateOfLoss: string;              // Date Of Loss
  causeOfLoss: string;             // Cause Of Loss (KERUSAKAN, dll.)
  // Timeline dokumen
  tglInformasiAwal: string;        // Tgl. Informasi Awal
  tglDokDiterima: string;          // Tgl. Dok. Diterima
  tglDokLengkap: string;           // Tgl. Dok. Lengkap
  suratKeputusanCabang: string;    // Surat Keputusan Cabang
  // Sistem fraud detection
  riskScore: number;
  status: ClaimStatus;
  sha256Hash: string;
  fraudRules: FraudRule[];
  auditLog: AuditLog[];
}

export interface User {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  company: string;
}

export const MOCK_USERS: User[] = [
  {
    username: 'insurer',
    password: 'insurer123',
    role: 'INSURER',
    displayName: 'PT Asuransi Jaya',
    company: 'PT Asuransi Jaya Tbk.',
  },
  {
    username: 'adjuster',
    password: 'adjuster123',
    role: 'ADJUSTER',
    displayName: 'Budi Santoso',
    company: 'Independent Adjuster',
  },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'CLM-001',
    nomorKlaim: '222012112000065',
    noPolis: '1222012012100051',
    namaPeserta: 'NURI AGUS RAMDHANI',
    periodePolisAwal: '29 Desember 2023',
    periodePolisAkhir: '16 Desember 2028',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 706181,
    dateOfLoss: '04 Maret 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '04 Maret 2025',
    tglDokDiterima: '10 Maret 2025',
    tglDokLengkap: '15 Maret 2025',
    suratKeputusanCabang: '27 Jun 2025',
    riskScore: 72,
    status: 'PENDING',
    sha256Hash: 'a3f4b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: true,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2025-03-04T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-03-04T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'CLM-002',
    nomorKlaim: '222012112000024',
    noPolis: '1422012012100002',
    namaPeserta: 'ANTON ABDURRACHMAN',
    periodePolisAwal: '16 Desember 2024',
    periodePolisAkhir: '16 Desember 2026',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 3500000,
    dateOfLoss: '06 Juni 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '06 Juni 2025',
    tglDokDiterima: '10 Juni 2025',
    tglDokLengkap: '15 Juni 2025',
    suratKeputusanCabang: '30 Juni 2025',
    riskScore: 35,
    status: 'APPROVED',
    sha256Hash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: false,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2025-06-06T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-06-06T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-06-16T14:00:00Z', action: 'APPROVED', user: 'Budi Santoso', justification: 'Dokumen lengkap dan valid. Tidak ada indikasi fraud.' },
    ],
  },
  {
    id: 'CLM-003',
    nomorKlaim: '222012112000028',
    noPolis: '1422012012100002',
    namaPeserta: 'ADE SENTOSA',
    periodePolisAwal: '06 Juni 2024',
    periodePolisAkhir: '04 Juni 2026',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 1000000,
    dateOfLoss: '09 Mei 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '19 Mei 2025',
    tglDokDiterima: '19 Mei 2025',
    tglDokLengkap: '27 Mei 2025',
    suratKeputusanCabang: '12 Juni 2025',
    riskScore: 28,
    status: 'APPROVED',
    sha256Hash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: false,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2025-05-19T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-05-19T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-05-27T10:00:00Z', action: 'APPROVED', user: 'Budi Santoso', justification: 'Dokumen lengkap. Nilai klaim wajar sesuai kerusakan.' },
    ],
  },
  {
    id: 'CLM-004',
    nomorKlaim: '222012112000028',
    noPolis: '1422012012100002',
    namaPeserta: 'YADI SUPRADIA',
    periodePolisAwal: '06 Juni 2024',
    periodePolisAkhir: '05 Juni 2026',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 2500000,
    dateOfLoss: '12 Mei 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '13 Mei 2025',
    tglDokDiterima: '15 Mei 2025',
    tglDokLengkap: '20 Mei 2025',
    suratKeputusanCabang: '05 Juni 2025',
    riskScore: 55,
    status: 'PENDING',
    sha256Hash: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: false,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: true,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Nomor klaim yang sama (222012112000028) juga diajukan oleh peserta lain.',
        triggered: true,
      },
    ],
    auditLog: [
      { timestamp: '2025-05-13T10:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-05-13T10:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'CLM-005',
    nomorKlaim: '222012112000031',
    noPolis: '1422012012100005',
    namaPeserta: 'ALDY HERMAWAN',
    periodePolisAwal: '06 Januari 2025',
    periodePolisAkhir: '06 Januari 2027',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 4750000,
    dateOfLoss: '20 Februari 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '20 Februari 2025',
    tglDokDiterima: '25 Februari 2025',
    tglDokLengkap: '01 Maret 2025',
    suratKeputusanCabang: '15 Maret 2025',
    riskScore: 41,
    status: 'PENDING',
    sha256Hash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: true,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2025-02-20T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-02-20T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'CLM-006',
    nomorKlaim: '222012112000024',
    noPolis: '1222012012100051',
    namaPeserta: 'ALDY HERMAWAN MDV-B/BS – S 1781 EZV',
    periodePolisAwal: '28 Februari 2025',
    periodePolisAkhir: '28 Februari 2027',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 8900000,
    dateOfLoss: '10 Maret 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '11 Maret 2025',
    tglDokDiterima: '14 Maret 2025',
    tglDokLengkap: '21 Maret 2025',
    suratKeputusanCabang: '05 April 2025',
    riskScore: 68,
    status: 'PENDING',
    sha256Hash: 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: false,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: true,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Nomor klaim 222012112000024 juga terdaftar atas nama peserta lain (Anton Abdurrachman).',
        triggered: true,
      },
    ],
    auditLog: [
      { timestamp: '2025-03-11T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-03-11T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'CLM-007',
    nomorKlaim: '222012112000024',
    noPolis: '1222012012100051',
    namaPeserta: 'NURI AGUS RAMDHANI',
    periodePolisAwal: '29 Desember 2023',
    periodePolisAkhir: '29 Desember 2027',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 4500000,
    dateOfLoss: '01 September 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '01 September 2025',
    tglDokDiterima: '01 September 2025',
    tglDokLengkap: '01 Oktober 2025',
    suratKeputusanCabang: '01 November 2025',
    riskScore: 85,
    status: 'REJECTED',
    sha256Hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal penerimaan dokumen — tidak ada interval proses.',
        triggered: true,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Nomor klaim 222012112000024 sebelumnya juga diajukan oleh peserta berbeda (CLM-002 & CLM-006).',
        triggered: true,
      },
    ],
    auditLog: [
      { timestamp: '2025-09-01T07:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-09-01T07:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-11-01T11:00:00Z', action: 'REJECTED', user: 'Budi Santoso', justification: '2 rule fraud aktif. Nomor klaim duplikat dan dokumen diterima di tanggal yang sama dengan informasi awal.' },
    ],
  },
  {
    id: 'CLM-008',
    nomorKlaim: '222012112000004',
    noPolis: '1422012012100002',
    namaPeserta: 'ALFIN MUGRIHA',
    periodePolisAwal: '08 November 2024',
    periodePolisAkhir: '04 November 2026',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 6200000,
    dateOfLoss: '08 November 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '08 November 2025',
    tglDokDiterima: '12 November 2025',
    tglDokLengkap: '20 November 2025',
    suratKeputusanCabang: '10 Desember 2025',
    riskScore: 47,
    status: 'PENDING',
    sha256Hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.',
        triggered: true,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: false,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2025-11-08T10:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-11-08T10:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'CLM-009',
    nomorKlaim: '222012112040004',
    noPolis: '1422012012100002',
    namaPeserta: 'WENDY HUSMAN N – 1639 TM – BMS',
    periodePolisAwal: '30 April 2024',
    periodePolisAkhir: '26 Mei 2028',
    bengkelRekenan: 'SAPPHIRE',
    nilaiKlaimDiajukan: 9401000,
    dateOfLoss: '24 Januari 2026',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '28 Januari 2026',
    tglDokDiterima: '28 Januari 2026',
    tglDokLengkap: '15 Februari 2026',
    suratKeputusanCabang: '01 April 2026',
    riskScore: 62,
    status: 'PENDING',
    sha256Hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    fraudRules: [
      {
        code: 'FR-001',
        name: 'Anomali Waktu Kejadian',
        description: 'Tanggal informasi awal (28 Jan) berbeda 4 hari dari kejadian (24 Jan) — masih dalam batas wajar.',
        triggered: false,
      },
      {
        code: 'FR-002',
        name: 'Nilai Klaim Berlebih',
        description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.',
        triggered: true,
      },
      {
        code: 'FR-003',
        name: 'Duplikasi Klaim',
        description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.',
        triggered: false,
      },
    ],
    auditLog: [
      { timestamp: '2026-01-28T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2026-01-28T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
];

// Mock API functions
export function mockLogin(username: string, password: string): User | null {
  return MOCK_USERS.find(u => u.username === username && u.password === password) || null;
}

export function mockGetClaims(): Claim[] {
  return [...MOCK_CLAIMS];
}

export function mockGetPendingClaims(): Claim[] {
  return MOCK_CLAIMS.filter(c => c.status === 'PENDING');
}

export function mockUpdateClaimStatus(
  claimId: string,
  status: 'APPROVED' | 'REJECTED',
  adjusterName: string,
  justification: string
): Claim | null {
  const claim = MOCK_CLAIMS.find(c => c.id === claimId);
  if (!claim) return null;

  claim.status = status;
  claim.auditLog.push({
    timestamp: new Date().toISOString(),
    action: status,
    user: adjusterName,
    justification,
  });
  return claim;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
