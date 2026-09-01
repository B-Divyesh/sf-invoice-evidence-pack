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

export const MALFORMED_BACKUP_MESSAGE = 'This backup file is damaged or not valid JSON. Choose an Invoice Packet JSON backup and try again.';

export function evidenceArchiveNames(packet: Packet, redactFilenames: boolean): Array<string | null> {
  const used = new Set<string>();
  return packet.items.map((item, index) => {
    if (!item.fileName) return null;
    const base = redactFilenames
      ? redactedName(item, index)
      : safeFilename(item.fileName, `evidence-${index + 1}`);
    const extension = extensionOf(base);
    const stem = extension ? base.slice(0, -extension.length) : base;
    let candidate = base;
    let duplicate = 2;
    while (used.has(candidate.normalize('NFKC').toLocaleLowerCase('en-US'))) {
      const suffix = `-${duplicate}`;
      candidate = `${stem.slice(0, Math.max(1, 80 - extension.length - suffix.length))}${suffix}${extension}`;
      duplicate += 1;
    }
    used.add(candidate.normalize('NFKC').toLocaleLowerCase('en-US'));
    return candidate;
  });
}

export function buildManifest(packet: Packet, redactFilenames: boolean): PacketManifest {
  const progress = progressFor(packet);
  const archiveNames = evidenceArchiveNames(packet, redactFilenames);
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
      filename: item.fileName ? (redactFilenames ? archiveNames[index] : item.fileName) : null,
      archiveFilename: archiveNames[index],
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
  const archiveNames = evidenceArchiveNames(packet, redactFilenames);
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
    const name = archiveNames[index] as string;
    await writer.add(`evidence/${name}`, new BlobReader(item.file));
  }
  const blob = await writer.close();
  download(blob, `${safeFilename(packet.title)}${password ? '-encrypted' : ''}.zip`);
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(/\s+/);
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
  await import('regenerator-runtime/runtime.js');
  const [{ default: fontkit }, { PDFDocument, rgb }] = await Promise.all([
    import('@pdf-lib/fontkit'),
    import('pdf-lib'),
  ]);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [baseResponse, japaneseResponse] = await Promise.all([
    fetch('/assets/noto-sans-devanagari.ttf'),
    fetch('/assets/noto-sans-jp.ttf'),
  ]);
  if (!baseResponse.ok || !japaneseResponse.ok) throw new Error('The PDF text fonts could not be loaded.');
  let [regular, japanese] = await Promise.all([
    pdf.embedFont(await baseResponse.arrayBuffer(), { subset: true }),
    pdf.embedFont(await japaneseResponse.arrayBuffer(), { subset: true }),
  ]);
  let baseCharacters = new Set(regular.getCharacterSet());
  let japaneseCharacters = new Set(japanese.getCharacterSet());
  const packetText = [
    packet.title, packet.invoiceNumber, packet.client, packet.invoiceDate, packet.jurisdiction, packet.currency, packet.notes,
    ...packet.items.flatMap((item) => [item.label, item.description, item.fileName || '', item.sha256 || '']),
  ].join('');
  const requiresFullScriptFonts = Array.from(packetText.normalize('NFC')).some((character) => {
    const codePoint = character.codePointAt(0) as number;
    return !baseCharacters.has(codePoint) && !japaneseCharacters.has(codePoint);
  });
  // The small core subsets cover the shipped cross-border examples. An unusual
  // script character pulls the complete local source font only for that export,
  // preserving arbitrary Devanagari/Japanese metadata without making a first
  // offline installation download multi-megabyte export assets.
  if (requiresFullScriptFonts) {
    const [fullBaseResponse, fullJapaneseResponse] = await Promise.all([
      fetch('/assets/noto-sans-devanagari-full.ttf'),
      fetch('/assets/noto-sans-jp-full.ttf'),
    ]);
    if (!fullBaseResponse.ok || !fullJapaneseResponse.ok) throw new Error('The complete PDF text fonts could not be loaded.');
    [regular, japanese] = await Promise.all([
      pdf.embedFont(await fullBaseResponse.arrayBuffer(), { subset: true }),
      pdf.embedFont(await fullJapaneseResponse.arrayBuffer(), { subset: true }),
    ]);
    baseCharacters = new Set(regular.getCharacterSet());
    japaneseCharacters = new Set(japanese.getCharacterSet());
  }
  const textRuns = (value: string) => {
    const runs: Array<{ text: string; font: typeof regular }> = [];
    for (const sourceCharacter of Array.from(value.normalize('NFC'))) {
      const codePoint = sourceCharacter.codePointAt(0) as number;
      const character = baseCharacters.has(codePoint) || japaneseCharacters.has(codePoint) ? sourceCharacter : '\uFFFD';
      const font = baseCharacters.has(codePoint) ? regular : japanese;
      const last = runs.at(-1);
      if (last?.font === font) last.text += character;
      else runs.push({ text: character, font });
    }
    return runs;
  };
  const green = rgb(0.094, 0.192, 0.161);
  const muted = rgb(0.35, 0.42, 0.39);
  let page = pdf.addPage([595, 842]);
  let y = 790;
  const drawLine = (text: string, size = 10, font = regular, color = green, indent = 0) => {
    if (y < 64) { page = pdf.addPage([595, 842]); y = 790; }
    let x = 48 + indent;
    for (const run of textRuns(text)) {
      const runFont = font === regular ? run.font : font;
      page.drawText(run.text, { x, y, size, font: runFont, color });
      x += runFont.widthOfTextAtSize(run.text, size);
    }
    y -= size + 7;
  };
  drawLine('INVOICE PACKET / MANIFEST', 10, regular, muted);
  drawLine(packet.title, 23, regular);
  y -= 4;
  drawLine(`Invoice: ${packet.invoiceNumber || 'Not recorded'}   Client: ${packet.client || 'Not recorded'}`, 10);
  drawLine(`Date: ${packet.invoiceDate || 'Not recorded'}   Jurisdiction: ${packet.jurisdiction || 'Not specified'}   Currency: ${packet.currency || 'Not specified'}`, 10);
  const progress = progressFor(packet);
  drawLine(`Completion: ${progress.complete} of ${progress.required} required items (${progress.percent}%)`, 11, regular, progress.missing.length ? rgb(0.61, 0.37, 0.07) : green);
  y -= 12;
  drawLine('EVIDENCE INDEX', 11, regular, muted);
  packet.items.forEach((item, index) => {
    const state = item.file ? 'PRESENT' : item.required ? 'MISSING / REQUIRED' : 'NOT PROVIDED / OPTIONAL';
    drawLine(`${String(index + 1).padStart(2, '0')}  ${item.label}  [${state}]`, 10, regular);
    if (item.fileName) drawLine(`File: ${redactFilenames ? redactedName(item, index) : item.fileName}`, 9, regular, muted, 18);
    if (item.sha256) drawLine(`SHA-256: ${item.sha256}`, 8, regular, muted, 18);
    y -= 5;
  });
  if (packet.notes.trim()) {
    y -= 8;
    drawLine('ACCOUNTANT NOTES', 11, regular, muted);
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
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(MALFORMED_BACKUP_MESSAGE);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('This is not a supported Invoice Packet backup.');
  }
  const data = parsed as AppBackup;
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
