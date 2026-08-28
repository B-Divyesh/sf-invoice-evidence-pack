import type { AppBackup, EvidenceItem, Packet, PacketTemplate } from './types';
import { extensionOf, progressFor, safeFilename } from './utils';

interface PacketManifest {
  format: string;
  packet: Record<string, string>;
  completion: Record<string, number | boolean>;
  evidence: Array<Record<string, string | number | boolean | null>>;
  accountantNotes: string;
  generatedAt: string;
  notice: string;
}

export function buildManifest(packet: Packet, redactFilenames: boolean): PacketManifest {
  const progress = progressFor(packet);
  return {
    format: 'invoice-evidence-manifest/v1',
    packet: {
      title: packet.title,
      invoiceNumber: packet.invoiceNumber,
      client: packet.client,
      invoiceDate: packet.invoiceDate,
      jurisdiction: packet.jurisdiction,
      currency: packet.currency,
      packetId: packet.id,
      lastUpdated: packet.updatedAt,
    },
    completion: {
      complete: progress.missing.length === 0,
      requiredPresent: progress.complete,
      requiredTotal: progress.required,
      percent: progress.percent,
    },
    evidence: packet.items.map((item, index) => ({
      order: index + 1,
      label: item.label,
      description: item.description,
      required: item.required,
      status: item.file ? 'present' : item.required ? 'missing-required' : 'not-provided-optional',
      filename: item.fileName ? (redactFilenames ? redactedName(item, index) : item.fileName) : null,
      originalFilenameRedacted: redactFilenames && Boolean(item.fileName),
      mediaType: item.fileType || null,
      bytes: item.fileSize ?? null,
      sha256: item.sha256 || null,
    })),
    accountantNotes: packet.notes,
    generatedAt: new Date().toISOString(),
    notice: 'Organizational record only. Invoice Packet does not provide legal or tax advice and does not submit filings.',
  };
}

function redactedName(item: EvidenceItem, index: number): string {
  return `${String(index + 1).padStart(2, '0')}-evidence${extensionOf(item.fileName || '')}`;
}

export function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export async function exportZip(packet: Packet, redactFilenames: boolean, password?: string): Promise<void> {
  const { BlobReader, BlobWriter, TextReader, ZipWriter } = await import('@zip.js/zip.js');
  const options = password ? { password, encryptionStrength: 3 as const } : undefined;
  const writer = new ZipWriter(new BlobWriter('application/zip'), options);
  const manifest = buildManifest(packet, redactFilenames);
  await writer.add('manifest.json', new TextReader(JSON.stringify(manifest, null, 2)));
  await writer.add('README.txt', new TextReader([
    'INVOICE PACKET',
    '',
    'This archive was assembled locally with Invoice Packet.',
    'Verify each file using its SHA-256 value in manifest.json.',
    'Missing required evidence is explicitly marked in the manifest.',
    '',
    'This organizational record is not legal or tax advice.',
  ].join('\n')));
  for (const [index, item] of packet.items.entries()) {
    if (!item.file || !item.fileName) continue;
    const name = redactFilenames ? redactedName(item, index) : safeFilename(item.fileName, `evidence-${index + 1}`);
    await writer.add(`evidence/${name}`, new BlobReader(item.file));
  }
  const blob = await writer.close();
  download(blob, `${safeFilename(packet.title)}${password ? '-encrypted' : ''}.zip`);
}

function latinText(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?');
}

function wrapText(text: string, maxLength: number): string[] {
  const words = latinText(text).split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (`${current} ${word}`.trim().length > maxLength && current) {
      lines.push(current);
      current = word;
    } else current = `${current} ${word}`.trim();
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

export async function exportPdf(packet: Packet, redactFilenames: boolean): Promise<void> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const green = rgb(0.094, 0.192, 0.161);
  const muted = rgb(0.35, 0.42, 0.39);
  let page = pdf.addPage([595, 842]);
  let y = 790;
  const drawLine = (text: string, size = 10, font = regular, color = green, indent = 0) => {
    if (y < 64) { page = pdf.addPage([595, 842]); y = 790; }
    page.drawText(latinText(text), { x: 48 + indent, y, size, font, color });
    y -= size + 7;
  };
  drawLine('INVOICE PACKET / MANIFEST', 10, bold, muted);
  drawLine(packet.title, 23, bold);
  y -= 4;
  drawLine(`Invoice: ${packet.invoiceNumber || 'Not recorded'}   Client: ${packet.client || 'Not recorded'}`, 10);
  drawLine(`Date: ${packet.invoiceDate || 'Not recorded'}   Jurisdiction: ${packet.jurisdiction || 'Not specified'}   Currency: ${packet.currency || 'Not specified'}`, 10);
  const progress = progressFor(packet);
  drawLine(`Completion: ${progress.complete} of ${progress.required} required items (${progress.percent}%)`, 11, bold, progress.missing.length ? rgb(0.61, 0.37, 0.07) : green);
  y -= 12;
  drawLine('EVIDENCE INDEX', 11, bold, muted);
  packet.items.forEach((item, index) => {
    const state = item.file ? 'PRESENT' : item.required ? 'MISSING / REQUIRED' : 'NOT PROVIDED / OPTIONAL';
    drawLine(`${String(index + 1).padStart(2, '0')}  ${item.label}  [${state}]`, 10, bold);
    if (item.fileName) drawLine(`File: ${redactFilenames ? redactedName(item, index) : item.fileName}`, 9, regular, muted, 18);
    if (item.sha256) drawLine(`SHA-256: ${item.sha256}`, 8, regular, muted, 18);
    y -= 5;
  });
  if (packet.notes.trim()) {
    y -= 8;
    drawLine('ACCOUNTANT NOTES', 11, bold, muted);
    wrapText(packet.notes, 88).forEach((line) => drawLine(line, 10));
  }
  y -= 10;
  drawLine('Organizational record only — not legal or tax advice.', 9, regular, muted);
  drawLine(`Generated locally ${new Date().toISOString()}`, 8, regular, muted);
  const bytes = await pdf.save();
  download(new Blob([bytes as BlobPart], { type: 'application/pdf' }), `${safeFilename(packet.title)}-manifest.pdf`);
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBlob(value: string, type: string): Blob {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type });
}

export async function createBackup(packets: Packet[], templates: PacketTemplate[]): Promise<AppBackup> {
  return {
    format: 'invoice-packet-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    templates,
    packets: await Promise.all(packets.map(async (packet) => ({
      ...packet,
      items: await Promise.all(packet.items.map(async ({ file, ...item }) => ({
        ...item,
        fileBase64: file ? await blobToBase64(file) : undefined,
      }))),
    }))),
  };
}

export function parseBackup(text: string): { packets: Packet[]; templates: PacketTemplate[] } {
  const data = JSON.parse(text) as AppBackup;
  if (data.format !== 'invoice-packet-backup' || data.version !== 1 || !Array.isArray(data.packets)) {
    throw new Error('This is not a supported Invoice Packet backup.');
  }
  const packets = data.packets.map((packet) => ({
    ...packet,
    items: packet.items.map(({ fileBase64, ...item }) => ({
      ...item,
      file: fileBase64 ? base64ToBlob(fileBase64, item.fileType || 'application/octet-stream') : undefined,
    })),
  }));
  return { packets, templates: Array.isArray(data.templates) ? data.templates : [] };
}

