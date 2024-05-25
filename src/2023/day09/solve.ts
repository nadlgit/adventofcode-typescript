import { handleInputLines, sum } from '#utils/index.js';
import { extrapolateNextValue, extrapolatePrevValue, parseSequence } from './sensor.js';

export async function solvePart1(filepath: string) {
  const sequences = await handleInputLines(filepath, parseSequence);
  const nextValues = sequences.map((seq) => extrapolateNextValue(seq));
  return sum(nextValues);
}

export async function solvePart2(filepath: string) {
  const sequences = await handleInputLines(filepath, parseSequence);
  const prevValues = sequences.map((seq) => extrapolatePrevValue(seq));
  return sum(prevValues);
}
