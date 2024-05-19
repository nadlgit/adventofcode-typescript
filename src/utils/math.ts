export function sum(nums: number[]) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

export function multiply(nums: number[]) {
  return nums.reduce((acc, curr) => acc * curr, 1);
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
