import { getInputLines, sum } from '#utils/index.js';
import { execProgram, parseProgramLine } from './corrupted-program.js';

export function solvePart1(filepath: string) {
  const instructions = getInputLines(filepath).flatMap(parseProgramLine);
  return sum(execProgram(instructions, false));
}

export function solvePart2(filepath: string) {
  const instructions = getInputLines(filepath).flatMap(parseProgramLine);
  return sum(execProgram(instructions, true));
}
