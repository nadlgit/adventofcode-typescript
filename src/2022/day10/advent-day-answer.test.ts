import { getAdventDaySolveData } from '#utils/index.js';
import day from './index.js';

const { inputFilePath, answerPart1, answerPart2 } = await getAdventDaySolveData(import.meta.url);

it.runIf(inputFilePath && answerPart1)('solve part 1', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await day.part1.solve(inputFilePath!);
  expect(String(result as unknown)).toBe(answerPart1);
});

it.runIf(day.part2 && inputFilePath && answerPart2)('solve part 2', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await day.part2!.solve(inputFilePath!);
  expect(result).toEqual([
    '###..#..#..##...##...##..###..#..#.####.',
    '#..#.#..#.#..#.#..#.#..#.#..#.#..#....#.',
    '###..#..#.#....#..#.#....###..#..#...#..',
    '#..#.#..#.#....####.#....#..#.#..#..#...',
    '#..#.#..#.#..#.#..#.#..#.#..#.#..#.#....',
    '###...##...##..#..#..##..###...##..####.',
  ]);
});
