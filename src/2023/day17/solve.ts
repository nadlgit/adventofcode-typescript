import { getInputLines } from '#utils/index.js';
import { CityBlocks, findPathLeastHeatLoss } from './crucible.js';

export function solvePart1(filepath: string) {
  const city = new CityBlocks(getInputLines(filepath));
  return findPathLeastHeatLoss(city, 'basic');
}

export function solvePart2(filepath: string) {
  const city = new CityBlocks(getInputLines(filepath));
  return findPathLeastHeatLoss(city, 'ultra');
}
