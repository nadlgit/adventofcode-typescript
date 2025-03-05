import { execSync } from 'node:child_process';
import console from 'node:console';
import process from 'node:process';
import { getDayDirPaths } from './common.js';

const year = process.argv[2];
const day = process.argv[3];
if (!year || !day) {
  console.error('Arguments <year> and <day> are mandatory.');
  process.exit(1);
}

const { srcDirPath } = getDayDirPaths(year, day);
execSync(`pnpm run test --dir ${srcDirPath}`, { stdio: 'inherit' });
