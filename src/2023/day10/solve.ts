import { getInputLines } from '#utils/index.js';
import { Maze, countLoopTilesEnclosed, countLoopFarthestSteps } from './maze.js';

export function solvePart1(filepath: string) {
  const maze = new Maze(getInputLines(filepath));
  return countLoopFarthestSteps(maze);
}

export function solvePart2(filepath: string) {
  const maze = new Maze(getInputLines(filepath));
  return countLoopTilesEnclosed(maze);
}
