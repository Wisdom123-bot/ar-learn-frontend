import Dexie, { type Table } from 'dexie';

export interface OfflineAction {
  id?: number;
  type: "attendance" | "results" | "admission" | "discipline";
  payload: any;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  timestamp: number;
  synced: 0 | 1; // 0 for pending, 1 for synced
}

export class ArLearnDB extends Dexie {
  offlineActions!: Table<OfflineAction>;

  constructor() {
    super('ArLearnDB');
    this.version(1).stores({
      offlineActions: '++id, type, synced, timestamp'
    });
  }
}

// Lazy initialization to avoid SSR issues
let dbInstance: ArLearnDB | null = null;

export const getDB = (): ArLearnDB | null => {
  if (typeof window === 'undefined') return null;
  if (!dbInstance) {
    dbInstance = new ArLearnDB();
  }
  return dbInstance;
};
