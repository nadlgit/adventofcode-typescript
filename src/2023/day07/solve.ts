import { getInputLines, sum } from '#utils/index.js';
import { parseHand, sortHandList } from './hand.js';

export function solvePart1(filepath: string) {
  const hands = getInputLines(filepath).map((line) => parseHand(line));
  const winnings = sortHandList(hands).map(({ rank, bid }) => rank * bid);
  return sum(winnings);
}

export function solvePart2(filepath: string) {
  const hands = getInputLines(filepath).map((line) => parseHand(line));
  const winnings = sortHandList(hands, true).map(({ rank, bid }) => rank * bid);
  return sum(winnings);
}
