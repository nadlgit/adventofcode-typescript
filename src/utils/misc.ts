import deepEqual from 'deep-equal';

export function isDeepEqual(a: object, b: object): boolean {
  return deepEqual(a, b, { strict: true });
}

export function memoize<A extends any[], R>(func: (...args: A) => R) {
  const cache = new Map<string, R>();
  return (...args: A) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, func(...args));
    }
    return cache.get(key) as R;
  };
}
