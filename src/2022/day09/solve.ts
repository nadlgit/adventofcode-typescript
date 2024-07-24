import { handleInputLines } from '#utils/index.js';
import { parseMoveLine, RopeSimulation } from './rope.js';

export async function solvePart1(filepath: string) {
  const rope = new RopeSimulation(2);
  await handleInputLines(filepath, (line) => {
    const move = parseMoveLine(line);
    if (move) {
      rope.handleMove(move);
    }
  });
  return rope.countTailVisitedPositions();
}

export async function solvePart2(filepath: string) {
  const rope = new RopeSimulation(10);
  await handleInputLines(filepath, (line) => {
    const move = parseMoveLine(line);
    if (move) {
      rope.handleMove(move);
    }
  });
  return rope.countTailVisitedPositions();
}
