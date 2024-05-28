import { handleInputLines, sum } from '#utils/index.js';
import { calcOutcomeStrategyScore, calcShapeStrategyScore } from './round.js';

export async function solvePart1(filepath: string) {
  const scores = await handleInputLines(filepath, calcShapeStrategyScore);
  return sum(scores);
}

export async function solvePart2(filepath: string) {
  const scores = await handleInputLines(filepath, calcOutcomeStrategyScore);
  return sum(scores);
}
