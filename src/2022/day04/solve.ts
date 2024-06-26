import { getInputLines } from '#utils/index.js';
import { isFullyContainingPair, isOverlappingPair } from './range-overlap.js';

export function solvePart1(filepath: string) {
  return getInputLines(filepath).filter((line) => isFullyContainingPair(line)).length;
}

export function solvePart2(filepath: string) {
  return getInputLines(filepath).filter((line) => isOverlappingPair(line)).length;
}
