export interface ChecklistSeed {
  label: string;
  description: string;
  required: boolean;
}

export interface PacketTemplate {
  id: string;
  name: string;
  description: string;
  seeds: ChecklistSeed[];
  custom?: boolean;
}

export interface EvidenceItem extends ChecklistSeed {
  id: string;
  file?: Blob;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileModified?: number;
  sha256?: string;
}

export interface HistoryEntry {
  at: string;
  action: string;
}

export interface Packet {
  id: string;
  title: string;
  invoiceNumber: string;
  client: string;
  invoiceDate: string;
  jurisdiction: string;
  currency: string;
  templateId: string;
  notes: string;
  items: EvidenceItem[];
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}

export interface AppBackup {
  format: 'invoice-packet-backup';
  version: 1;
  exportedAt: string;
  packets: Array<Omit<Packet, 'items'> & { items: Array<Omit<EvidenceItem, 'file'> & { fileBase64?: string }> }>;
  templates: PacketTemplate[];
}

