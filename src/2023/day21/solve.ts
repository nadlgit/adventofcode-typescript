import { getInputLines } from '#utils/index.js';
import { findReachablePlots, Garden, specificCountReachablePlots } from './step-counter.js';

export function solvePart1(filepath: string) {
  const steps = filepath.includes('example-input.txt') ? 6 : 64;
  const garden = new Garden(getInputLines(filepath));
  return findReachablePlots(garden, steps).length;
}

export function solvePart2(filepath: string) {
  const garden = new Garden(getInputLines(filepath));
  return specificCountReachablePlots(garden, 26501365);
}
