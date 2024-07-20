import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkFileExistence, getDayDirPaths } from './common.js';

const year = process.argv[2];
const day = process.argv[3];
if (!year || !day) {
  console.error('Arguments <year> and <day> are mandatory.');
  process.exit(1);
}

async function solveDay() {
  const { dataDirPath, distDirPath, srcDirPath } = getDayDirPaths(year, day);

  const scriptFilepath = join(distDirPath, 'index.js');
  checkFileExistence(scriptFilepath);
  const daySolution = (await import(pathToFileURL(scriptFilepath))).default;

  const runs = [];
  for (const part in daySolution) {
    const { solve, examples } = daySolution[part];
    for (let i = 0; i < examples.length; i++) {
      const { filename, expected } = examples[i];
      const name = `${part} example ${i + 1}`;
      runs.push({
        name,
        solve,
        filepath: join(srcDirPath, filename),
        output: (value) => console.timeLog(name, 'result=', value, 'expected=', expected),
      });
    }
    const name = `${part} puzzle`;
    runs.push({
      name,
      solve,
      filepath: join(dataDirPath, 'puzzle-input.txt'),
      output: (value) => console.timeLog(name, 'result=', value),
    });
  }

  runs.forEach(({ name, solve, filepath, output }) => {
    checkFileExistence(filepath);
    console.time(name);
    const result = solve(filepath);
    result instanceof Promise ? result.then((value) => output(value)) : output(result);
  });
}

solveDay();
