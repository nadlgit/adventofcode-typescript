import { getInputLines } from '#utils/index.js';
import { findStartMarker } from './signal-marker.js';

export function solvePart1(filepath: string) {
  const buffer = getInputLines(filepath)[0];
  return findStartMarker(buffer, 4).charsToContent;
}

export function solvePart2(filepath: string) {
  const buffer = getInputLines(filepath)[0];
  return findStartMarker(buffer, 14).charsToContent;
}
