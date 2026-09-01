import type { EvidenceItem, Packet } from './types';

export const MAX_EVIDENCE_BYTES = 100 * 1024 * 1024;

export function evidenceSizeAllowed(bytes: number): boolean {
  return bytes <= MAX_EVIDENCE_BYTES;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

export function safeFilename(value: string, fallback = 'invoice-packet'): string {
  const normalized = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const clean = normalized.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return clean || fallback;
}

export function extensionOf(filename: string): string {
  const match = filename.match(/(\.[a-zA-Z0-9]{1,10})$/);
  return match?.[1].toLowerCase() ?? '';
}

export function displayBytes(bytes = 0): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}

export function progressFor(packet: Packet): { complete: number; required: number; percent: number; missing: EvidenceItem[] } {
  const requiredItems = packet.items.filter((item) => item.required);
  const missing = requiredItems.filter((item) => !item.file);
  const complete = requiredItems.length - missing.length;
  return {
    complete,
    required: requiredItems.length,
    percent: requiredItems.length ? Math.round((complete / requiredItems.length) * 100) : 100,
    missing,
  };
}

export async function sha256(file: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function shortHash(hash = ''): string {
  return hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : '';
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function localDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: iso.includes('T') ? 'short' : undefined }).format(new Date(iso));
}
