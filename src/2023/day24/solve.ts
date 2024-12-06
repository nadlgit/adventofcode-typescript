import { getInputLines } from '#utils/index.js';
import { countXYAreaIntersections, parseHail } from './hail.js';

export function solvePart1(filepath: string) {
  const [areaMin, areaMax] = filepath.includes('example-input.txt')
    ? [7, 27]
    : [200000000000000, 400000000000000];
  const hail = parseHail(getInputLines(filepath));
  return countXYAreaIntersections(hail, areaMin, areaMax);
}

export function solvePart2(filepath: string) {
  return -1;
}
