import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath),
    examples: [
      { filename: 'example-input1.txt', expected: 4 },
      { filename: 'example-input2.txt', expected: 8 },
    ],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [
      { filename: 'example-input3.txt', expected: 4 },
      { filename: 'example-input4.txt', expected: 4 },
      { filename: 'example-input5.txt', expected: 8 },
      { filename: 'example-input6.txt', expected: 10 },
    ],
  },
};

export default day;
