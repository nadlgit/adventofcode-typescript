import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath),
    examples: [{ filename: 'example-input.txt', expected: 24000 }],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [{ filename: 'example-input.txt', expected: 45000 }],
  },
};

export default day;
