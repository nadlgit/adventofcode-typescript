import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath),
    examples: [
      { filename: 'example-input1.txt', expected: 32000000 },
      { filename: 'example-input2.txt', expected: 11687500 },
    ],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [],
  },
};

export default day;
