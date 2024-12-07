import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath),
    examples: [{ filename: 'example-input.txt', expected: 41 }],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [{ filename: 'example-input.txt', expected: 6 }],
  },
};

export default day;
