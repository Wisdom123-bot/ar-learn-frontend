"use client";

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data: any;
  timestamp: number;
}

const STORAGE_KEY = "ar_learn_offline_queue";

export function addToQueue(url: string, method: string, data: any) {
  if (typeof window === "undefined") return;

  const queue: QueuedRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  queue.push({
    id: Math.random().toString(36).substr(2, 9),
    url,
    method,
    data,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function processQueue(apiInstance: any) {
  if (typeof window === "undefined" || !navigator.onLine) return;

  const queue: QueuedRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (queue.length === 0) return;

  console.log(`Processing ${queue.length} offline requests...`);
  const remaining: QueuedRequest[] = [];

  for (const req of queue) {
    try {
      await apiInstance({
        url: req.url,
        method: req.method,
        data: req.data,
      });
    } catch (err) {
      console.error(`Failed to sync request ${req.id}`, err);
      remaining.push(req); // Keep in queue if failed again
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}

export function getQueueLength(): number {
  if (typeof window === "undefined") return 0;
  const queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return queue.length;
}
