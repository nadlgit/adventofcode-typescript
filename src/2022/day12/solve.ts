import { getInputLines } from '#utils/index.js';
import { findFewestStepsFromAllStarts, findFewestStepsFromStart, HillMap } from './hill.js';

export function solvePart1(filepath: string) {
  const map = new HillMap(getInputLines(filepath));
  return findFewestStepsFromStart(map);
}

export function solvePart2(filepath: string) {
  const map = new HillMap(getInputLines(filepath));
  return findFewestStepsFromAllStarts(map);
}
