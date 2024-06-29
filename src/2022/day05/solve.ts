import { getInputLines } from '#utils/index.js';
import {
  applyMoveV9000,
  applyMoveV9001,
  getStacksTopCrates,
  parseCrateInstructions,
} from './crate-mover.js';

export function solvePart1(filepath: string) {
  const { stacks, instructions } = parseCrateInstructions(getInputLines(filepath));
  for (const instruction of instructions) {
    applyMoveV9000(instruction, stacks);
  }
  return getStacksTopCrates(stacks).join('');
}

export function solvePart2(filepath: string) {
  const { stacks, instructions } = parseCrateInstructions(getInputLines(filepath));
  for (const instruction of instructions) {
    applyMoveV9001(instruction, stacks);
  }
  return getStacksTopCrates(stacks).join('');
}
