import type { Packet, PacketTemplate } from './types';

const DB_NAME = 'invoice-packet';
const DB_VERSION = 1;
const PACKETS = 'packets';
const TEMPLATES = 'templates';

let openPromise: Promise<IDBDatabase> | undefined;

function request<T>(value: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    value.onsuccess = () => resolve(value.result);
    value.onerror = () => reject(value.error ?? new Error('Local database request failed.'));
  });
}

export function openDatabase(): Promise<IDBDatabase> {
  openPromise ??= new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(PACKETS)) db.createObjectStore(PACKETS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(TEMPLATES)) db.createObjectStore(TEMPLATES, { keyPath: 'id' });
    };
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error ?? new Error('Could not open local storage.'));
    open.onblocked = () => reject(new Error('Another tab is preventing a storage update. Close it and reload.'));
  });
  return openPromise;
}

async function store(name: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openDatabase();
  return db.transaction(name, mode).objectStore(name);
}

export async function listPackets(): Promise<Packet[]> {
  const rows = await request((await store(PACKETS, 'readonly')).getAll() as IDBRequest<Packet[]>);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function savePacket(packet: Packet): Promise<void> {
  await request((await store(PACKETS, 'readwrite')).put(packet));
}

export async function removePacket(id: string): Promise<void> {
  await request((await store(PACKETS, 'readwrite')).delete(id));
}

export async function listCustomTemplates(): Promise<PacketTemplate[]> {
  return request((await store(TEMPLATES, 'readonly')).getAll() as IDBRequest<PacketTemplate[]>);
}

export async function saveTemplate(template: PacketTemplate): Promise<void> {
  await request((await store(TEMPLATES, 'readwrite')).put(template));
}

export async function replaceAllData(packets: Packet[], templates: PacketTemplate[]): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([PACKETS, TEMPLATES], 'readwrite');
    const packetStore = transaction.objectStore(PACKETS);
    const templateStore = transaction.objectStore(TEMPLATES);
    packetStore.clear();
    templateStore.clear();
    packets.forEach((packet) => packetStore.put(packet));
    templates.forEach((template) => templateStore.put(template));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not import the backup.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('The backup import was cancelled.'));
  });
}

