import { getInputLines } from '#utils/index.js';
import { Disk } from './disk-fragmenter.js';

export function solvePart1(filepath: string) {
  const disk = Disk.parseMap(getInputLines(filepath)[0]);
  disk.compact('block');
  return disk.fsChecksum();
}

export function solvePart2(filepath: string) {
  const disk = Disk.parseMap(getInputLines(filepath)[0]);
  disk.compact('file');
  return disk.fsChecksum();
}
