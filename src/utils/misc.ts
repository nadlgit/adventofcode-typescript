export function isEqualObject(a: object, b: object): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

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
  private items: Set<string> = new Set();

  constructor(items: T[] = []) {
    for (const item of items) {
      this.add(item);
    }
  }

  has(item: T): boolean {
    return this.items.has(JSON.stringify(item));
  }

  add(item: T): void {
    this.items.add(JSON.stringify(item));
  }
}
