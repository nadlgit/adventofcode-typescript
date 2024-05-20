import { sum } from '#utils/index.js';

export function parseSequence(line: string): number[] {
  return line.split(' ').map((value) => Number.parseInt(value));
}

export function extrapolateNextValue(sequence: number[]): number {
  const seqLastValues: number[] = [];
  let current = [...sequence];
  while (current.some((n) => n !== 0)) {
    seqLastValues.push(current[current.length - 1]);
    current = current.reduce<number[]>((acc, num, idx) => {
      if (idx > 0) acc.push(num - current[idx - 1]);
      return acc;
    }, []);
  }
  return sum(seqLastValues);
}

export function extrapolatePrevValue(sequence: number[]): number {
  return extrapolateNextValue([...sequence].reverse());
}
