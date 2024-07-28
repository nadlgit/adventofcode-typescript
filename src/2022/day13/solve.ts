import { getInputLines, sum } from '#utils/index.js';
import { findDecoderKey, findRightOrderedPairs, parsePacketPairs } from './signal-packets.js';

export function solvePart1(filepath: string) {
  const pairs = parsePacketPairs(getInputLines(filepath));
  return sum(findRightOrderedPairs(pairs));
}

export function solvePart2(filepath: string) {
  const packets = parsePacketPairs(getInputLines(filepath)).flat();
  return findDecoderKey(packets);
}
