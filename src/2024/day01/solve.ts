import { getInputLines, sum } from '#utils/index.js';
import { ChiefNotes } from './chief-notes.js';

export function solvePart1(filepath: string) {
  const notes = ChiefNotes.parseLists(getInputLines(filepath));
  return sum(notes.calcDistance());
}

export function solvePart2(filepath: string) {
  const notes = ChiefNotes.parseLists(getInputLines(filepath));
  return sum(notes.calcSimilarityScore());
}
