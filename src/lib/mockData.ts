export type ClaimStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type UserRole = 'INSURER' | 'ADJUSTER' | 'REGULATOR';

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
  // Provider
  provider: string;                // Nama perusahaan asuransi
  // Sistem fraud detection
  riskScore: number;
  status: ClaimStatus;
  sha256Hash: string;
  fraudRules: FraudRule[];
  auditLog: AuditLog[];
}

export interface DoubleClaimGroup {
  namaPeserta: string;
  claims: Claim[];
  providers: string[];
  confidence: 'HIGH' | 'MEDIUM';
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
    company: 'PT Asuransi Jaya',
  },
  {
    username: 'insurer2',
    password: 'insurer456',
    role: 'INSURER',
    displayName: 'PT Asuransi Berkah',
    company: 'PT Asuransi Berkah',
  },
  {
    username: 'adjuster',
    password: 'adjuster123',
    role: 'ADJUSTER',
    displayName: 'Budi Santoso',
    company: 'Independent Adjuster',
  },
  {
    username: 'regulator',
    password: 'regulator123',
    role: 'REGULATOR',
    displayName: 'OJK Indonesia',
    company: 'Otoritas Jasa Keuangan',
  },
];

// ============================================================
// PT Asuransi Jaya Claims
// ============================================================
export const MOCK_CLAIMS_JAYA: Claim[] = [
  {
    id: 'JY-001',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 72,
    status: 'PENDING',
    sha256Hash: 'a3f4b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-03-04T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-03-04T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'JY-002',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 35,
    status: 'APPROVED',
    sha256Hash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-06-06T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-06-06T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-06-16T14:00:00Z', action: 'APPROVED', user: 'Budi Santoso', justification: 'Dokumen lengkap dan valid. Tidak ada indikasi fraud.' },
    ],
  },
  {
    id: 'JY-003',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 28,
    status: 'APPROVED',
    sha256Hash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-05-19T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-05-19T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-05-27T10:00:00Z', action: 'APPROVED', user: 'Budi Santoso', justification: 'Dokumen lengkap. Nilai klaim wajar sesuai kerusakan.' },
    ],
  },
  {
    id: 'JY-004',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 55,
    status: 'PENDING',
    sha256Hash: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Nomor klaim yang sama (222012112000028) juga diajukan oleh peserta lain.', triggered: true },
    ],
    auditLog: [
      { timestamp: '2025-05-13T10:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-05-13T10:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'JY-005',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 41,
    status: 'PENDING',
    sha256Hash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-02-20T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-02-20T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'JY-006',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 68,
    status: 'PENDING',
    sha256Hash: 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Nomor klaim 222012112000024 juga terdaftar atas nama peserta lain (Anton Abdurrachman).', triggered: true },
    ],
    auditLog: [
      { timestamp: '2025-03-11T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-03-11T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'JY-007',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 85,
    status: 'REJECTED',
    sha256Hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal penerimaan dokumen — tidak ada interval proses.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Nomor klaim 222012112000024 sebelumnya juga diajukan oleh peserta berbeda (JY-002 & JY-006).', triggered: true },
    ],
    auditLog: [
      { timestamp: '2025-09-01T07:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-09-01T07:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-11-01T11:00:00Z', action: 'REJECTED', user: 'Budi Santoso', justification: '2 rule fraud aktif. Nomor klaim duplikat dan dokumen diterima di tanggal yang sama dengan informasi awal.' },
    ],
  },
  {
    id: 'JY-008',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 47,
    status: 'PENDING',
    sha256Hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal identik dengan tanggal kejadian tanpa selang waktu pelaporan.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-11-08T10:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-11-08T10:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'JY-009',
    nomorKlaim: '222012112040004',
    noPolis: '1422012012100002',
    namaPeserta: 'WENDY HUSMAN N',
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
    provider: 'PT Asuransi Jaya',
    riskScore: 62,
    status: 'PENDING',
    sha256Hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal informasi awal (28 Jan) berbeda 4 hari dari kejadian (24 Jan) — masih dalam batas wajar.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel rekenan.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Pemegang polis sebelumnya mengajukan klaim serupa dalam 12 bulan terakhir.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2026-01-28T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2026-01-28T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
];

// ============================================================
// PT Asuransi Berkah Claims
// Some deliberately overlap with Jaya's claims (double claims)
// ============================================================
export const MOCK_CLAIMS_BERKAH: Claim[] = [
  // ⚠️ DOUBLE CLAIM: Same person as JY-001, different policy, similar date
  {
    id: 'BK-001',
    nomorKlaim: '330045220000012',
    noPolis: '2330045012200019',
    namaPeserta: 'NURI AGUS RAMDHANI',
    periodePolisAwal: '15 Januari 2024',
    periodePolisAkhir: '15 Januari 2027',
    bengkelRekenan: 'DIAMOND AUTO',
    nilaiKlaimDiajukan: 4200000,
    dateOfLoss: '06 Maret 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '07 Maret 2025',
    tglDokDiterima: '12 Maret 2025',
    tglDokLengkap: '20 Maret 2025',
    suratKeputusanCabang: '10 April 2025',
    provider: 'PT Asuransi Berkah',
    riskScore: 78,
    status: 'PENDING',
    sha256Hash: 'dd01a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal kejadian hanya 2 hari setelah klaim serupa di perusahaan lain.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim diajukan melebihi estimasi kerusakan standar bengkel.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Peserta ini juga memiliki klaim aktif di PT Asuransi Jaya (JY-001).', triggered: true },
    ],
    auditLog: [
      { timestamp: '2025-03-07T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-03-07T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'BK-002',
    nomorKlaim: '330045220000015',
    noPolis: '2330045012200023',
    namaPeserta: 'RINA MARLINA',
    periodePolisAwal: '01 Maret 2024',
    periodePolisAkhir: '01 Maret 2027',
    bengkelRekenan: 'GOLDEN CARS',
    nilaiKlaimDiajukan: 2150000,
    dateOfLoss: '15 April 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '16 April 2025',
    tglDokDiterima: '20 April 2025',
    tglDokLengkap: '28 April 2025',
    suratKeputusanCabang: '15 Mei 2025',
    provider: 'PT Asuransi Berkah',
    riskScore: 22,
    status: 'APPROVED',
    sha256Hash: 'ee12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Interval waktu pelaporan wajar (1 hari).', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim sesuai estimasi kerusakan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Tidak ditemukan klaim duplikat.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-04-16T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-04-16T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-04-28T14:00:00Z', action: 'APPROVED', user: 'Siti Aminah', justification: 'Dokumen valid, tidak ada indikasi fraud.' },
    ],
  },
  // ⚠️ DOUBLE CLAIM: Same person as JY-005, same dateOfLoss
  {
    id: 'BK-003',
    nomorKlaim: '330045220000018',
    noPolis: '2330045012200031',
    namaPeserta: 'ALDY HERMAWAN',
    periodePolisAwal: '10 Desember 2024',
    periodePolisAkhir: '10 Desember 2026',
    bengkelRekenan: 'DIAMOND AUTO',
    nilaiKlaimDiajukan: 5200000,
    dateOfLoss: '20 Februari 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '21 Februari 2025',
    tglDokDiterima: '26 Februari 2025',
    tglDokLengkap: '05 Maret 2025',
    suratKeputusanCabang: '20 Maret 2025',
    provider: 'PT Asuransi Berkah',
    riskScore: 88,
    status: 'PENDING',
    sha256Hash: 'ff23c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal kejadian identik dengan klaim di PT Asuransi Jaya (JY-005).', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim lebih tinggi dari klaim serupa di provider lain.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Peserta mengajukan klaim untuk kejadian sama di 2 perusahaan asuransi berbeda.', triggered: true },
    ],
    auditLog: [
      { timestamp: '2025-02-21T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-02-21T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'BK-004',
    nomorKlaim: '330045220000021',
    noPolis: '2330045012200042',
    namaPeserta: 'HENDRA GUNAWAN',
    periodePolisAwal: '05 Juli 2024',
    periodePolisAkhir: '05 Juli 2026',
    bengkelRekenan: 'GOLDEN CARS',
    nilaiKlaimDiajukan: 3800000,
    dateOfLoss: '12 Agustus 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '13 Agustus 2025',
    tglDokDiterima: '18 Agustus 2025',
    tglDokLengkap: '25 Agustus 2025',
    suratKeputusanCabang: '10 September 2025',
    provider: 'PT Asuransi Berkah',
    riskScore: 31,
    status: 'APPROVED',
    sha256Hash: 'aa34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Interval pelaporan wajar (1 hari).', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim dalam batas wajar.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Tidak ditemukan klaim duplikat.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-08-13T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-08-13T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2025-08-25T10:00:00Z', action: 'APPROVED', user: 'Siti Aminah', justification: 'Klaim valid, dokumentasi lengkap.' },
    ],
  },
  {
    id: 'BK-005',
    nomorKlaim: '330045220000025',
    noPolis: '2330045012200055',
    namaPeserta: 'DEWI SARTIKA',
    periodePolisAwal: '20 September 2024',
    periodePolisAkhir: '20 September 2026',
    bengkelRekenan: 'PLATINUM SERVICE',
    nilaiKlaimDiajukan: 6750000,
    dateOfLoss: '03 Oktober 2025',
    causeOfLoss: 'TABRAKAN',
    tglInformasiAwal: '03 Oktober 2025',
    tglDokDiterima: '07 Oktober 2025',
    tglDokLengkap: '15 Oktober 2025',
    suratKeputusanCabang: '30 Oktober 2025',
    provider: 'PT Asuransi Berkah',
    riskScore: 45,
    status: 'PENDING',
    sha256Hash: 'bb45e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Informasi awal diterima di hari yang sama dengan kejadian.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim sesuai standar kerusakan tabrakan.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Tidak ditemukan klaim duplikat.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-10-03T10:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-10-03T10:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  // ⚠️ DOUBLE CLAIM: Same person as JY-009, close dateOfLoss
  {
    id: 'BK-006',
    nomorKlaim: '330045220000030',
    noPolis: '2330045012200068',
    namaPeserta: 'WENDY HUSMAN N',
    periodePolisAwal: '01 Juni 2024',
    periodePolisAkhir: '01 Juni 2027',
    bengkelRekenan: 'DIAMOND AUTO',
    nilaiKlaimDiajukan: 7800000,
    dateOfLoss: '26 Januari 2026',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '27 Januari 2026',
    tglDokDiterima: '30 Januari 2026',
    tglDokLengkap: '10 Februari 2026',
    suratKeputusanCabang: '28 Februari 2026',
    provider: 'PT Asuransi Berkah',
    riskScore: 82,
    status: 'PENDING',
    sha256Hash: 'cc56f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Tanggal kejadian berdekatan (2 hari) dengan klaim di PT Asuransi Jaya.', triggered: true },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim tergolong tinggi untuk jenis kerusakan serupa.', triggered: true },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Peserta memiliki klaim aktif untuk kejadian serupa di PT Asuransi Jaya (JY-009).', triggered: true },
    ],
    auditLog: [
      { timestamp: '2026-01-27T08:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2026-01-27T08:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
    ],
  },
  {
    id: 'BK-007',
    nomorKlaim: '330045220000033',
    noPolis: '2330045012200075',
    namaPeserta: 'FIRMAN HIDAYAT',
    periodePolisAwal: '15 November 2024',
    periodePolisAkhir: '15 November 2026',
    bengkelRekenan: 'PLATINUM SERVICE',
    nilaiKlaimDiajukan: 1850000,
    dateOfLoss: '22 Desember 2025',
    causeOfLoss: 'KERUSAKAN',
    tglInformasiAwal: '23 Desember 2025',
    tglDokDiterima: '27 Desember 2025',
    tglDokLengkap: '05 Januari 2026',
    suratKeputusanCabang: '20 Januari 2026',
    provider: 'PT Asuransi Berkah',
    riskScore: 18,
    status: 'APPROVED',
    sha256Hash: 'dd67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
    fraudRules: [
      { code: 'FR-001', name: 'Anomali Waktu Kejadian', description: 'Interval pelaporan wajar.', triggered: false },
      { code: 'FR-002', name: 'Nilai Klaim Berlebih', description: 'Nilai klaim rendah, sesuai standar.', triggered: false },
      { code: 'FR-003', name: 'Duplikasi Klaim', description: 'Tidak ditemukan klaim duplikat.', triggered: false },
    ],
    auditLog: [
      { timestamp: '2025-12-23T09:00:00Z', action: 'CLAIM_SUBMITTED', user: 'system' },
      { timestamp: '2025-12-23T09:05:00Z', action: 'FRAUD_ANALYSIS_COMPLETE', user: 'system' },
      { timestamp: '2026-01-05T11:00:00Z', action: 'APPROVED', user: 'Siti Aminah', justification: 'Klaim valid, nilai wajar.' },
    ],
  },
];

// Legacy alias — keeps existing INSURER dashboard backward-compatible
export const MOCK_CLAIMS = MOCK_CLAIMS_JAYA;

// ============================================================
// Mock API functions
// ============================================================

export function mockLogin(username: string, password: string): User | null {
  return MOCK_USERS.find(u => u.username === username && u.password === password) || null;
}

export function mockGetClaims(): Claim[] {
  return [...MOCK_CLAIMS_JAYA];
}

export function mockGetClaimsByProvider(provider: string): Claim[] {
  return mockGetAllClaims().filter(c => c.provider === provider);
}

export function mockGetAllClaims(): Claim[] {
  return [...MOCK_CLAIMS_JAYA, ...MOCK_CLAIMS_BERKAH];
}

export function mockGetPendingClaims(): Claim[] {
  return MOCK_CLAIMS_JAYA.filter(c => c.status === 'PENDING');
}

export function mockGetPendingClaimsByProvider(provider: string): Claim[] {
  return mockGetAllClaims().filter(c => c.status === 'PENDING' && c.provider === provider);
}

export function mockUpdateClaimStatus(
  claimId: string,
  status: 'APPROVED' | 'REJECTED',
  adjusterName: string,
  justification: string
): Claim | null {
  const allClaims = [...MOCK_CLAIMS_JAYA, ...MOCK_CLAIMS_BERKAH];
  const claim = allClaims.find(c => c.id === claimId);
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

/**
 * Detect potential double claims across providers.
 * Groups claims by normalized namaPeserta where more than one provider is involved.
 */
export function detectDoubleClaims(): DoubleClaimGroup[] {
  const allClaims = mockGetAllClaims();
  const byName = new Map<string, Claim[]>();

  for (const claim of allClaims) {
    // Normalize: uppercase, trim, take first two words to catch variations
    const key = claim.namaPeserta.trim().toUpperCase().split(/\s+/).slice(0, 2).join(' ');
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(claim);
  }

  const groups: DoubleClaimGroup[] = [];

  for (const [, claims] of byName) {
    const providers = [...new Set(claims.map(c => c.provider))];
    if (providers.length > 1) {
      // Multiple providers → cross-provider double claim
      groups.push({
        namaPeserta: claims[0].namaPeserta,
        claims,
        providers,
        confidence: 'HIGH',
      });
    }
  }

  return groups;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
