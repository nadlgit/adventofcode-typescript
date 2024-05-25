import { handleInputLines, sum } from '#utils/index.js';
import { countRecordArrangements, countUnfoldRecordArrangements } from './spring.js';

export async function solvePart1(filepath: string) {
  const counts = await handleInputLines(filepath, countRecordArrangements);
  return sum(counts);
}

export async function solvePart2(filepath: string) {
  const counts = await handleInputLines(filepath, countUnfoldRecordArrangements);
  return sum(counts);
}
