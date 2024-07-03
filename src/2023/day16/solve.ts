import { getInputLines } from '#utils/index.js';
import { EnergyGrid, countEnergizedTiles } from './energy-grid.js';

export function solvePart1(filepath: string) {
  const grid = new EnergyGrid(getInputLines(filepath));
  return countEnergizedTiles(grid, { row: 0, col: 0, directionTo: 'right' });
}

export function solvePart2(filepath: string) {
  const grid = new EnergyGrid(getInputLines(filepath));
  return Math.max(
    ...grid.getBeamEnterings().map((entering) => countEnergizedTiles(grid, entering))
  );
}
