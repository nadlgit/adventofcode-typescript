import { getInputLines } from '#utils/index.js';
import { WordSearch } from './word-search.js';

export function solvePart1(filepath: string) {
  const wordSearch = new WordSearch(getInputLines(filepath));
  return wordSearch.countXmas();
}

export function solvePart2(filepath: string) {
  const wordSearch = new WordSearch(getInputLines(filepath));
  return wordSearch.countCrossMas();
}
