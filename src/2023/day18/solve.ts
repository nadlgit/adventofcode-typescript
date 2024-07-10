import { handleInputLines } from '#utils/index.js';
import { calcLagoonVolume, parseCorrectInstruction, parseInstruction } from './digging.js';

export async function solvePart1(filepath: string) {
  const plan = await handleInputLines(filepath, parseInstruction);
  return calcLagoonVolume(plan);
}

export async function solvePart2(filepath: string) {
  const plan = await handleInputLines(filepath, parseCorrectInstruction);
  return calcLagoonVolume(plan);
}
