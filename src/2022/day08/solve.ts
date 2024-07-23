import { getInputLines } from '#utils/index.js';
import { TreeMap } from './trees.js';

export function solvePart1(filepath: string) {
  const treemap = new TreeMap(getInputLines(filepath));
  let count = 0;
  for (let r = 0; r < treemap.nbRows; r++) {
    for (let c = 0; c < treemap.nbCols; c++) {
      if (treemap.isTreeVisibleFromOutside([r, c])) {
        count++;
      }
    }
  }
  return count;
}

export function solvePart2(filepath: string) {
  const treemap = new TreeMap(getInputLines(filepath));
  let maxScore = 0;
  for (let r = 0; r < treemap.nbRows; r++) {
    for (let c = 0; c < treemap.nbCols; c++) {
      maxScore = Math.max(maxScore, treemap.getTreeScenicScore([r, c]));
    }
  }
  return maxScore;
}
