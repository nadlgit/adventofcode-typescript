import { getInputLines, multiply, sum } from '#utils/index.js';
import { parseInput, processPart, processPossibleRanges } from './part-sorter.js';

export function solvePart1(filepath: string) {
  const { workflows, parts } = parseInput(getInputLines(filepath));
  const acceptedParts = parts.filter((part) => processPart(workflows, part) === 'A');
  return sum(acceptedParts.flatMap((part) => Object.values(part)));
}

export function solvePart2(filepath: string) {
  const { workflows } = parseInput(getInputLines(filepath));
  const acceptedRanges = processPossibleRanges(workflows).A;
  return sum(
    acceptedRanges.map((range) =>
      multiply(Object.values(range).map(([start, end]) => end - start + 1))
    )
  );
}
