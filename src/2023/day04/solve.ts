import { handleInputLines, sum } from '#utils/index.js';
import {
  calcWinningPoints,
  countFinalCards,
  identifyWinningNumbers,
  parseCard,
} from './scratchcard.js';

export async function solvePart1(filepath: string) {
  const cards = await handleInputLines(filepath, parseCard);
  const points = cards.map(({ winningList, playerList }) =>
    calcWinningPoints(identifyWinningNumbers(winningList, playerList))
  );
  return sum(points);
}

export async function solvePart2(filepath: string) {
  const cards = await handleInputLines(filepath, parseCard);
  const finalCounts = countFinalCards(cards);
  return sum(finalCounts);
}
