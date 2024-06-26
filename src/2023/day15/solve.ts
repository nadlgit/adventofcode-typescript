import { getInputLines, sum } from '#utils/index.js';
import { calcLensFocusingPower, hashString, performInitSequence } from './lens.js';

export function solvePart1(filepath: string) {
  const steps = getInputLines(filepath)[0].split(',');
  const hashValues = steps.map((step) => hashString(step));
  return sum(hashValues);
}

export function solvePart2(filepath: string) {
  const steps = getInputLines(filepath)[0].split(',');
  const focusingPowers = performInitSequence(steps).map((lens) => calcLensFocusingPower(lens));
  return sum(focusingPowers);
}
