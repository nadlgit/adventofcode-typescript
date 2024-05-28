import { getInputLines, sum } from '#utils/index.js';
import { calcFixedPatternSummary, calcPatternSummary, parsePatterns } from './reflections.js';

export function solvePart1(filepath: string) {
  const patterns = parsePatterns(getInputLines(filepath));
  const summaries = patterns.map((pattern) => calcPatternSummary(pattern));
  return sum(summaries);
}

export function solvePart2(filepath: string) {
  const patterns = parsePatterns(getInputLines(filepath));
  const summaries = patterns.map((pattern) => calcFixedPatternSummary(pattern));
  return sum(summaries);
}
