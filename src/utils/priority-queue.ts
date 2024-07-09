export class PriorityQueue<T> {
  private internal: Array<T>;
  private sortFn: (a: T, b: T) => number;

  constructor(items: T[], priorityCalculator: (item: T) => number) {
    this.internal = [...items];
    this.sortFn = (a, b) => priorityCalculator(a) - priorityCalculator(b);
    this.internal.sort(this.sortFn);
  }

  get size(): number {
    return this.internal.length;
  }

  peek(): T | null {
    return this.internal.length > 0 ? this.internal[0] : null;
  }

  enqueue(item: T): void {
    this.internal.push(item);
    this.internal.sort(this.sortFn);
  }

  enqueueAll(...items: T[]): void {
    this.internal.push(...items);
    this.internal.sort(this.sortFn);
  }

  dequeue(): T | null {
    return this.internal.shift() ?? null;
  }
}
