import { createReadStream } from 'node:fs';
import { dirname, basename, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

type AdventDayPart<T> = {
  solve: (filepath: string) => T | Promise<T>;
  examples: { filename: string; expected: T }[];
};

export type AdventDay<T1 = number, T2 = T1> = {
  part1: AdventDayPart<T1>;
  part2?: AdventDayPart<T2>;
};

export async function getAdventDaySolveData(scriptUrl: string): Promise<{
  inputFilePath?: string;
  answerPart1?: string;
  answerPart2?: string;
}> {
  const scriptDir = dirname(fileURLToPath(scriptUrl));
  const scriptYear = basename(dirname(scriptDir));
  const scriptDay = basename(scriptDir);
  const scriptDayNum = Number.parseInt(scriptDay.replace('day', ''));

  const inputFilePath = join('data', scriptYear, scriptDay, 'puzzle-input.txt');

  const answersFilePath = join('data', 'puzzle-answers.md');
  let answerPart1;
  let answerPart2;
  const rl = createInterface({ input: createReadStream(answersFilePath) });
  for await (const line of rl) {
    const [, year, day, part1, part2] = line.split('|').map((s) => s.trim());
    if (year === scriptYear && Number.parseInt(day) === scriptDayNum) {
      answerPart1 = part1;
      answerPart2 = part2;
      break;
    }
  }

  return { inputFilePath, answerPart1, answerPart2 };
}
