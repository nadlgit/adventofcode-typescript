import { handleInputLines, sum } from '#utils/index.js';
import { parseHand, sortHandList } from './hand.js';

export async function solvePart1(filepath: string) {
  const hands = await handleInputLines(filepath, parseHand);
  const winnings = sortHandList(hands).map(({ rank, bid }) => rank * bid);
  return sum(winnings);
}

export async function solvePart2(filepath: string) {
  const hands = await handleInputLines(filepath, parseHand);
  const winnings = sortHandList(hands, true).map(({ rank, bid }) => rank * bid);
  return sum(winnings);
}
