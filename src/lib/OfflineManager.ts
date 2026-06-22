import api from "./api";
import { getDB, type OfflineAction } from "./db";

class OfflineManager {
  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        console.log("[OfflineManager] System back online, triggering sync...");
        this.syncQueue();
      });
      // Initial sync attempt in next tick to ensure components have mounted
      setTimeout(() => this.syncQueue(), 1000);
    }
  }

  public async saveAction(
    type: OfflineAction["type"],
    payload: any,
    endpoint: string,
    method: OfflineAction["method"] = "POST"
  ) {
    const db = getDB();
    if (!db) return;

    const action: OfflineAction = {
      type,
      payload,
      endpoint,
      method,
      timestamp: Date.now(),
      synced: 0
    };

    await db.offlineActions.add(action);

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.syncQueue();
    }
  }

  public async syncQueue() {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    const db = getDB();
    if (!db) return;

    try {
      const pendingActions = await db.offlineActions
        .where('synced')
        .equals(0)
        .toArray();

      if (pendingActions.length === 0) return;

      console.log(`[OfflineManager] Syncing ${pendingActions.length} actions...`);

      for (const action of pendingActions) {
        try {
          await api({
            url: action.endpoint,
            method: action.method,
            data: action.payload
          });

          await db.offlineActions.update(action.id!, { synced: 1 });
          console.log(`[OfflineManager] Synced action ${action.id}`);
        } catch (err) {
          console.error(`[OfflineManager] Sync failed for ${action.id}`, err);
        }
      }
    } catch (err) {
      console.error("[OfflineManager] Database access error during sync", err);
    }
  }

  public async getPendingCount() {
    const db = getDB();
    if (!db) return 0;
    try {
      return await db.offlineActions.where('synced').equals(0).count();
    } catch (e) {
      return 0;
    }
  }
}

// Global instance
const offlineManager = typeof window !== 'undefined' ? new OfflineManager() : null;
export default offlineManager;
