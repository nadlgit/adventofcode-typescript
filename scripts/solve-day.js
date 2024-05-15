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
  Object.entries(daySolution).forEach(([part, { solve, examples }]) => {
    for (const { filename, expected } of examples) {
      runs.push({
        solve,
        filepath: join(srcDirPath, filename),
        output: (value) =>
          console.log(`${part} example check:`, 'result=', value, 'expected=', expected),
      });
    }
    runs.push({
      solve,
      filepath: join(dataDirPath, 'puzzle-input.txt'),
      output: (value) => console.log(`${part} puzzle result:`, value),
    });
  });

  runs.forEach(({ solve, filepath, output }) => {
    checkFileExistence(filepath);
    const result = solve(filepath);
    result instanceof Promise ? result.then((value) => output(value)) : output(result);
  });
}
solveDay();
