import console from 'node:console';
import { cpSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { checkDay, checkYear, getDayDirPaths } from './common.js';

const year = process.argv[2];
const day = process.argv[3];
if (!year || !day) {
  console.error('Arguments <year> and <day> are mandatory.');
  process.exit(1);
}
checkYear(year);
checkDay(day);

const { dataDirPath, srcDirPath } = getDayDirPaths(year, day);

cpSync(join('template', 'day-src'), srcDirPath, {
  recursive: true,
  force: false,
  errorOnExist: true,
});

cpSync(join('template', 'day-data'), dataDirPath, {
  recursive: true,
  force: false,
  errorOnExist: true,
});
