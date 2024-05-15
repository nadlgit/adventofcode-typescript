import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function checkYear(year) {
  const minYear = 2015;
  const today = new Date();
  const maxYear = today.getFullYear();
  if (!Number.parseInt(year) || year < minYear || year > maxYear) {
    console.error(`Year should be between ${minYear} and ${maxYear}.`);
    process.exit(1);
  }
}

export function checkDay(day) {
  const minDay = 1;
  const maxDay = 25;
  if (!Number.parseInt(day) || day < minDay || day > maxDay) {
    console.error(`Day should be between ${minDay} and ${maxDay}.`);
    process.exit(1);
  }
}

export function checkFileExistence(filepath) {
  if (!existsSync(filepath)) {
    console.error(`File "${filepath}" not found.`);
    process.exit(1);
  }
}

export function getDayDirPaths(year, day) {
  const daySubdir = join(year.toString(), 'day' + day.toString().padStart(2, '0'));
  return {
    dataDirPath: join('data', daySubdir),
    srcDirPath: join('src', daySubdir),
    distDirPath: join('dist', daySubdir),
  };
}
