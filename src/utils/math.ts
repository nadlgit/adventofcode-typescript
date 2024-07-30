export function sum(nums: number[]) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

export function multiply(nums: number[]) {
  return nums.reduce((acc, curr) => acc * curr, 1);
}

export function solveQuadraticEquation(a: number, b: number, c: number) {
  // ax² + bx + c = 0
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0) return [];
  if (discriminant === 0) return [-b / (2 * a)];
  return [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
}

export function findQuadraticEquationFromPoints(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  [x3, y3]: [number, number]
): { a: number; b: number; c: number } {
  // y = ax² + bx + c
  const a =
    (y3 - y2 * ((x3 - x1) / (x2 - x1)) + y1 * ((x3 - x1) / (x2 - x1) - 1)) /
    (x3 ** 2 - x2 ** 2 * ((x3 - x1) / (x2 - x1)) + x1 ** 2 * ((x3 - x1) / (x2 - x1) - 1));
  const b = (a * (x1 ** 2 - x2 ** 2) + (y2 - y1)) / (x2 - x1);
  const c = -a * x1 ** 2 - b * x1 + y1;
  return { a, b, c };
}

export function numberPrimes(n: number) {
  const result = new Map<number, number>();
  let prime = 2;
  while (n > 1) {
    let pow = 0;
    while (n % prime === 0) {
      n /= prime;
      pow++;
    }
    if (pow > 0) {
      result.set(prime, pow);
    }
    prime++;
  }
  return result;
}

export function numberListPrimes(nums: number[]) {
  return nums.reduce<Map<number, number>>((acc, n) => {
    for (const [prime, pow] of numberPrimes(n)) {
      const prevPow = acc.get(prime) ?? 0;
      acc.set(prime, Math.max(prevPow, pow));
    }
    return acc;
  }, new Map());
}

export function leastCommonMultiple(nums: number[]): number {
  const primePowers = Array.from(numberListPrimes(nums)).map(([prime, pow]) => prime ** pow);
  return multiply(primePowers);
}

export function integerRange(from: number, to: number) {
  const length = Math.abs(to - from) + 1;
  const step = Math.sign(to - from);
  return Array.from(new Array(length), (_, i) => from + i * step);
}
