import { getInputLines, sum } from '#utils/index.js';
import { BricksGraph, parseBricksSnapshot, processBricksFall } from './sand-bricks.js';

export function solvePart1(filepath: string) {
  const snapshot = parseBricksSnapshot(getInputLines(filepath));
  const graph = new BricksGraph(processBricksFall(snapshot));
  return graph.bricks.filter((brick) => graph.isSafeToDisintegrate(brick)).length;
}

export function solvePart2(filepath: string) {
  const snapshot = parseBricksSnapshot(getInputLines(filepath));
  const graph = new BricksGraph(processBricksFall(snapshot));
  const otherBricksCount = graph.bricks.map(
    (brick) => graph.findDisintegrationImpact(brick).length
  );
  return sum(otherBricksCount);
}
