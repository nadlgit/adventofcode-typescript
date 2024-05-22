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

export function shoelaceArea(sortedVertices: [number, number][]) {
  // https://en.wikipedia.org/wiki/Shoelace_formula
  return Math.abs(
    sortedVertices.reduce((acc, [row, col], idx) => {
      const nextIdx = idx < sortedVertices.length - 1 ? idx + 1 : 0;
      const [nextRow, nextCol] = sortedVertices[nextIdx];
      return acc + row * nextCol - col * nextRow;
    }, 0) / 2
  );
}
