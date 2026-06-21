import api from "./api";
import { db, type OfflineAction } from "./db";

class OfflineManager {
  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.syncQueue());
      // Initial sync attempt
      this.syncQueue();
    }
  }

  /**
   * Saves an action to IndexedDB for later synchronization
   */
  public async saveAction(
    type: OfflineAction["type"],
    payload: any,
    endpoint: string,
    method: OfflineAction["method"] = "POST"
  ) {
    const action: OfflineAction = {
      type,
      payload,
      endpoint,
      method,
      timestamp: Date.now(),
      synced: 0
    };

    await db.offlineActions.add(action);

    // If online, try to sync immediately
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.syncQueue();
    }
  }

  /**
   * Processes the pending queue in IndexedDB
   */
  public async syncQueue() {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

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

        // Mark as synced instead of deleting immediately for history/audit
        await db.offlineActions.update(action.id!, { synced: 1 });
        console.log(`[OfflineManager] Synced action ${action.id}`);
      } catch (err) {
        console.error(`[OfflineManager] Sync failed for ${action.id}`, err);
        // We leave it as synced: 0 to retry next time
      }
    }
  }

  /**
   * Get count of pending actions for UI indicators
   */
  public async getPendingCount() {
    return await db.offlineActions.where('synced').equals(0).count();
  }
}

const offlineManager = new OfflineManager();
export default offlineManager;
