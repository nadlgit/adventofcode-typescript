import { getInputLines } from '#utils/index.js';
import { Cave, parseCaveScan } from './cave.js';

export function solvePart1(filepath: string) {
  const cave = new Cave(parseCaveScan(getInputLines(filepath)));
  while (cave.produceSandUnit() === 'resting') {
    // loop
  }
  return cave.sandRestingCount;
}

export function solvePart2(filepath: string) {
  const cave = new Cave(parseCaveScan(getInputLines(filepath)), true);
  while (cave.produceSandUnit() === 'resting') {
    // loop
  }
  return cave.sandRestingCount;
}
