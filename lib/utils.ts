import { nanoid } from 'nanoid';

/**
 * Generate URL-friendly slug dari nama event dan tanggal
 */
export function generateSlug(namaEvent: string, tanggal?: string): string {
  const cleanName = namaEvent
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter spesial
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Hapus dash ganda
    .trim();

  if (tanggal) {
    const date = new Date(tanggal);
    const year = date.getFullYear();
    return `${cleanName}-${year}`;
  }

  return cleanName;
}

/**
 * Generate secure edit token
 */
export function generateEditToken(): string {
  return nanoid(32); // 32 karakter random string
}

/**
 * Calculate token expiry date (30 hari setelah event selesai)
 */
export function calculateTokenExpiry(tanggalSelesai: string): Date {
  const eventEnd = new Date(tanggalSelesai);
  eventEnd.setDate(eventEnd.getDate() + 30);
  return eventEnd;
}

/**
 * Truncate text untuk preview card
 */
export function truncateText(text: string, maxLength: number = 120): string {
  // Strip HTML tags
  const stripped = text.replace(/<[^>]*>/g, '');
  
  if (stripped.length <= maxLength) {
    return stripped;
  }
  
  return stripped.substring(0, maxLength).trim() + '...';
}

/**
 * Format harga ke Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke bahasa Indonesia
 */
export function formatTanggalIndo(dateStr: string | null): string {
  if (!dateStr) return '-';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Deduplikasi array kategori jarak
 * Jika ada jarak kustom, map ke kategori standar
 */
export function deduplicateKategoriJarak(
  kategoriJarak: string[],
  jarakKustom?: string
): string[] {
  const categories = new Set(kategoriJarak);

  // Map jarak kustom ke kategori standar
  if (jarakKustom) {
    const distance = parseInt(jarakKustom);
    if (!isNaN(distance)) {
      if (distance === 5) categories.add('5K');
      else if (distance > 5 && distance < 10) categories.add('5-10km');
      else if (distance === 10) categories.add('10K');
      else if (distance > 10 && distance < 21) categories.add('11-21km');
      else if (distance === 21 || jarakKustom.toLowerCase().includes('hm')) categories.add('HM');
      else if (distance > 21 && distance < 42) categories.add('22-42km');
      else if (distance === 42 || jarakKustom.toLowerCase().includes('fm')) categories.add('FM');
      else if (distance > 42) categories.add('Ultra');
    }
  }

  return Array.from(categories);
}

/**
 * Validasi URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML untuk mencegah XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - untuk production gunakan library seperti DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

/**
 * Check if event is past deadline
 */
export function isPastDeadline(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date() > new Date(deadline);
}

/**
 * Check if event is past event date
 */
export function isPastEvent(tanggalSelesai: string | null, tanggalMulai: string | null): boolean {
  const endDate = tanggalSelesai || tanggalMulai;
  if (!endDate) return false;
  return new Date() > new Date(endDate);
}

/**
 * Calculate days until event
 */
export function daysUntilEvent(tanggalMulai: string): number {
  const now = new Date();
  const eventDate = new Date(tanggalMulai);
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
