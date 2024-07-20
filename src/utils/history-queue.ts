export class HistoryQueue<T> {
  private items: T[] = [];
  private history: Set<string> = new Set();

  constructor(items: T[] = []) {
    this.enqueueAll(...items);
  }

  get size(): number {
    return this.items.length;
  }

  enqueue(item: T): void {
    const historyKey = JSON.stringify(item);
    if (!this.history.has(historyKey)) {
      this.items.push(item);
      this.history.add(historyKey);
    }
  }

  enqueueAll(...items: T[]): void {
    for (const item of items) {
      this.enqueue(item);
    }
  }

  dequeue(): T | null {
    return this.items.shift() ?? null;
  }

  dequeueAll(): T[] {
    return this.items.splice(0);
  }
}
