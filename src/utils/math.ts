export function sum(nums: number[]) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

export function multiply(nums: number[]) {
  return nums.reduce((acc, curr) => acc * curr, 1);
}
