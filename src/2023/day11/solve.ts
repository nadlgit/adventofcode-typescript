import { getInputLines } from '#utils/index.js';
import { parseUniverse, sumGalaxiesShortestPaths } from './universe.js';

export function solvePart1(filepath: string) {
  const universe = parseUniverse(getInputLines(filepath));
  return sumGalaxiesShortestPaths(universe);
}

export function solvePart2(filepath: string) {
  const universe = parseUniverse(getInputLines(filepath));
  return sumGalaxiesShortestPaths(universe, 1000000);
}
