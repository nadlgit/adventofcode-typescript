export function memoize<A extends unknown[], R>(func: (...args: A) => R) {
  const cache = new Map<string, R>();
  return (...args: A) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, func(...args));
    }
    return cache.get(key) as R;
  };
}

export class ObjectSet<T extends object> {
  private readonly items: Set<string>;

  constructor(items: T[] = []) {
    this.items = new Set(items.map((item) => JSON.stringify(item)));
  }

  get size(): number {
    return this.items.size;
  }

  has(item: T): boolean {
    return this.items.has(JSON.stringify(item));
  }

  values(): T[] {
    return [...this.items.values()].map((str) => JSON.parse(str) as T);
  }

  add(item: T): void {
    this.items.add(JSON.stringify(item));
  }

  delete(item: T): void {
    this.items.delete(JSON.stringify(item));
  }

  clear(): void {
    this.items.clear();
  }
}
