import { type AdventDay } from '#utils/index.js';
import { solvePart1, solvePart2 } from './solve.js';

const day: AdventDay = {
  part1: {
    solve: (filepath) => solvePart1(filepath, { red: 12, green: 13, blue: 14 }),
    examples: [{ filename: 'example-input.txt', expected: 8 }],
  },
  part2: {
    solve: (filepath) => solvePart2(filepath),
    examples: [{ filename: 'example-input.txt', expected: 2286 }],
  },
};

export default day;
