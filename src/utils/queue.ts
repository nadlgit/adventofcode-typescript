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
