import { isEqualObject } from '#utils/index.js';

export type Range = [number, number];

export function parseRangePair(line: string): [Range, Range] {
  const [start1, end1, start2, end2] = line.split(/,|-/).map((str) => Number.parseInt(str));
  return [
    [start1, end1],
    [start2, end2],
  ];
}

export function findRangesOverlap(
  [rangeStart1, rangeEnd1]: Range,
  [rangeStart2, rangeEnd2]: Range
): Range | [] {
  const maxStart = Math.max(rangeStart1, rangeStart2);
  const minEnd = Math.min(rangeEnd1, rangeEnd2);
  return maxStart <= minEnd ? [maxStart, minEnd] : [];
}

export function isFullyContainingPair(line: string): boolean {
  const [range1, range2] = parseRangePair(line);
  const overlap = findRangesOverlap(range1, range2);
  return isEqualObject(overlap, range1) || isEqualObject(overlap, range2);
}

export function isOverlappingPair(line: string): boolean {
  const [range1, range2] = parseRangePair(line);
  const overlap = findRangesOverlap(range1, range2);
  return overlap.length === 2;
}
