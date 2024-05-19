import { getInputLines, leastCommonMultiple } from '#utils/index.js';
import { countNavigationSteps, getStartNodes, parseMap } from './network.js';

export function solvePart1(filepath: string) {
  const map = parseMap(getInputLines(filepath));
  return countNavigationSteps(map, 'AAA', 'ZZZ');
}

export function solvePart2(filepath: string) {
  const map = parseMap(getInputLines(filepath));
  const counts = getStartNodes(map).map((node) => countNavigationSteps(map, node));
  return leastCommonMultiple(counts);
}
