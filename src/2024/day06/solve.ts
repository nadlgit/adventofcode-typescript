import { getInputLines } from '#utils/index.js';
import {
  countGuardDistinctPositions,
  countPossibleObstructions,
  parseLabInput,
} from './guard-patrol.js';

export function solvePart1(filepath: string) {
  const { map, guardStart } = parseLabInput(getInputLines(filepath));
  return countGuardDistinctPositions(map, guardStart);
}

export function solvePart2(filepath: string) {
  const { map, guardStart } = parseLabInput(getInputLines(filepath));
  return countPossibleObstructions(map, guardStart);
}
