import { HeapMin } from './heap.js';

export class PriorityQueue<T> {
  private internal: HeapMin<T>;

  constructor(items: T[], private priorityCalculator: (item: T) => number) {
    this.internal = new HeapMin(items.map((item) => ({ item, key: priorityCalculator(item) })));
  }

  get size(): number {
    return this.internal.size;
  }

  peek(): T | null {
    return this.internal.peek();
  }

  enqueue(item: T): void {
    this.internal.insert(item, this.priorityCalculator(item));
  }

  enqueueAll(...items: T[]): void {
    for (const item of items) {
      this.internal.insert(item, this.priorityCalculator(item));
    }
  }

  dequeue(): T | null {
    return this.internal.extract();
  }
}

export class SetQueue<T> {
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
