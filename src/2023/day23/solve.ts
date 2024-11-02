import { getInputLines } from '#utils/index.js';
import { TrailsGraph } from './hiking-trails.js';

export function solvePart1(filepath: string) {
  const graph = new TrailsGraph(getInputLines(filepath), 'slippery');
  return graph.findLongestPathLength();
}

export function solvePart2(filepath: string) {
  const graph = new TrailsGraph(getInputLines(filepath), 'dry');
  return graph.findLongestPathLength();
}
