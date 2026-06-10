import api from "./api";

interface OfflineAction {
  id: string;
  type: "attendance" | "results";
  payload: any;
  timestamp: number;
}

class OfflineManager {
  private queueKey = "ar_learn_offline_queue";

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.syncQueue());
    }
  }

  public async saveAction(type: OfflineAction["type"], payload: any) {
    const action: OfflineAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp: Date.now(),
    };

    const queue = this.getQueue();
    queue.push(action);
    localStorage.setItem(this.queueKey, JSON.stringify(queue));

    // Attempt sync if online
    if (navigator.onLine) {
      await this.syncQueue();
    }
  }

  private getQueue(): OfflineAction[] {
    const stored = localStorage.getItem(this.queueKey);
    return stored ? JSON.parse(stored) : [];
  }

  public async syncQueue() {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline actions...`);
    const remaining: OfflineAction[] = [];

    for (const action of queue) {
      try {
        let endpoint = "";
        if (action.type === "attendance") endpoint = "/attendance/record";
        else if (action.type === "results") endpoint = "/results/submit";

        await api.post(endpoint, action.payload);
        console.log(`Synced action ${action.id}`);
      } catch (err) {
        console.error(`Failed to sync action ${action.id}`, err);
        remaining.push(action);
      }
    }

    localStorage.setItem(this.queueKey, JSON.stringify(remaining));
  }
}

const offlineManager = new OfflineManager();
export default offlineManager;
