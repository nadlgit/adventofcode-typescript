import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath),
    examples: [
      { filename: 'example-input-1.txt', expected: 2 },
      { filename: 'example-input-2.txt', expected: 4 },
      { filename: 'example-input-main.txt', expected: 14 },
    ],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [
      { filename: 'example-input-3.txt', expected: 9 },
      { filename: 'example-input-main.txt', expected: 34 },
    ],
  },
};

export default day;
