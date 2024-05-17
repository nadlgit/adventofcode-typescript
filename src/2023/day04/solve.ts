import { getInputLines, sum } from '#utils/index.js';
import {
  calcWinningPoints,
  countFinalCards,
  identifyWinningNumbers,
  parseCard,
} from './scratchcard.js';

export function solvePart1(filepath: string) {
  const cards = getInputLines(filepath).map((line) => parseCard(line));
  const points = cards.map(({ winningList, playerList }) =>
    calcWinningPoints(identifyWinningNumbers(winningList, playerList))
  );
  return sum(points);
}

export function solvePart2(filepath: string) {
  const cards = getInputLines(filepath).map((line) => parseCard(line));
  const finalCounts = countFinalCards(cards);
  return sum(finalCounts);
}
