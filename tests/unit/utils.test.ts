import { describe, expect, it } from 'vitest';
import { buildManifest, createBackup, evidenceArchiveNames, MALFORMED_BACKUP_MESSAGE, parseBackup } from '../../src/exports';
import type { Packet } from '../../src/types';
import { displayBytes, escapeHtml, evidenceSizeAllowed, MAX_EVIDENCE_BYTES, progressFor, safeFilename, sha256 } from '../../src/utils';

function packet(): Packet {
  return {
    id: 'packet-1',
    title: 'Acme / INV 042',
    invoiceNumber: 'INV-042',
    client: 'Acme & Co',
    invoiceDate: '2026-08-20',
    jurisdiction: 'India',
    currency: 'USD',
    templateId: 'test',
    notes: 'Payment landed net of fees.',
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    history: [],
    items: [
      { id: 'one', label: 'Issued invoice', description: 'Final copy', required: true, file: new Blob(['invoice']), fileName: 'Client Name Invoice.pdf', fileType: 'application/pdf', fileSize: 7, sha256: 'abc123' },
      { id: 'two', label: 'Payment receipt', description: 'Bank advice', required: true },
      { id: 'three', label: 'Fee note', description: 'Optional', required: false },
    ],
  };
}

describe('packet helpers', () => {
  it('calculates completion from required evidence only', () => {
    expect(progressFor(packet())).toMatchObject({ complete: 1, required: 2, percent: 50 });
    expect(progressFor(packet()).missing.map((item) => item.label)).toEqual(['Payment receipt']);
  });

  it('makes safe portable filenames and readable sizes', () => {
    expect(safeFilename('Acme / INV 042')).toBe('Acme-INV-042');
    expect(displayBytes(1_536)).toBe('1.5 KiB');
    expect(escapeHtml('<invoice "x">')).toBe('&lt;invoice &quot;x&quot;&gt;');
  });

  it('@claim:file-size-limit accepts 100 MiB and rejects the next byte', () => {
    expect(evidenceSizeAllowed(MAX_EVIDENCE_BYTES)).toBe(true);
    expect(evidenceSizeAllowed(MAX_EVIDENCE_BYTES + 1)).toBe(false);
    expect(displayBytes(MAX_EVIDENCE_BYTES)).toBe('100.0 MiB');
  });

  it('@claim:missing-flags @claim:filename-redaction builds explicit missing flags and redacts filenames', () => {
    const manifest = buildManifest(packet(), true);
    expect(manifest.completion).toMatchObject({ complete: false, requiredPresent: 1, requiredTotal: 2 });
    expect(manifest.evidence[0]).toMatchObject({ filename: '01-evidence.pdf', originalFilenameRedacted: true, status: 'present' });
    expect(manifest.evidence[1].status).toBe('missing-required');
    expect(manifest.evidence[2].status).toBe('not-provided-optional');
  });

  it('@claim:sha256-hash hashes evidence using SHA-256', async () => {
    expect(await sha256(new Blob(['invoice']))).toBe('52d6e3de4fa0dcc29946695f93940c3e7f26f30e1e39f4b1a49ad98839112786');
  });

  it('assigns stable case-insensitive archive names to duplicate source filenames', () => {
    const duplicatePacket = packet();
    duplicatePacket.items = [
      { ...duplicatePacket.items[0], id: 'one', fileName: 'proof.pdf' },
      { ...duplicatePacket.items[0], id: 'two', fileName: 'PROOF.PDF' },
      { ...duplicatePacket.items[0], id: 'three', fileName: 'proof-2.pdf' },
      { ...duplicatePacket.items[0], id: 'four', fileName: 'proof.pdf' },
    ];
    expect(evidenceArchiveNames(duplicatePacket, false)).toEqual([
      'proof.pdf',
      'PROOF-2.pdf',
      'proof-2-2.pdf',
      'proof-3.pdf',
    ]);
    expect(buildManifest(duplicatePacket, false).evidence.map((item) => item.archiveFilename)).toEqual(
      evidenceArchiveNames(duplicatePacket, false),
    );
  });

  it('@claim:json-backup round-trips files through the owned-data backup', async () => {
    const backup = await createBackup([packet()], []);
    const restored = parseBackup(JSON.stringify(backup));
    expect(await restored.packets[0].items[0].file?.text()).toBe('invoice');
    expect(restored.packets[0].client).toBe('Acme & Co');
  });

  it('gives a plain recovery step for malformed backup JSON', () => {
    expect(() => parseBackup('{not valid')).toThrow(MALFORMED_BACKUP_MESSAGE);
  });
});
