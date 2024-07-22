import { getInputLines, sum } from '#utils/index.js';
import { FileSystem } from './filesystem.js';

export function solvePart1(filepath: string) {
  const fs = FileSystem.fromTerminalOutput(getInputLines(filepath));
  return sum(
    fs
      .getUsedSizeByDirectory()
      .map(({ size }) => size)
      .filter((size) => size <= 100000)
  );
}

export function solvePart2(filepath: string) {
  const fs = FileSystem.fromTerminalOutput(getInputLines(filepath));
  const freeSpace = 70000000 - sum(fs.files.map(({ size }) => size));
  const neededSpace = 30000000 - freeSpace;
  return neededSpace > 0
    ? Math.min(
        ...fs
          .getUsedSizeByDirectory()
          .map(({ size }) => size)
          .filter((size) => size >= neededSpace)
      )
    : 0;
}
