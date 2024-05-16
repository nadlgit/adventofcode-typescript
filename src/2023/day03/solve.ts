import { getInputLines, sum } from '#utils/index.js';
import { EngineSchematic } from './engine.js';

export function solvePart1(filepath: string) {
  const schematic = new EngineSchematic(getInputLines(filepath));
  return sum(schematic.getPartNumbers());
}

export function solvePart2(filepath: string) {
  const schematic = new EngineSchematic(getInputLines(filepath));
  return sum(schematic.getGearRatios());
}
