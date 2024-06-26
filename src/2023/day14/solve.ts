import { getInputLines } from '#utils/index.js';
import { Platform } from './platform.js';

export function solvePart1(filepath: string) {
  const platform = new Platform(getInputLines(filepath));
  platform.tiltNorth();
  return platform.getNorthBeamsLoad();
}

export function solvePart2(filepath: string) {
  const platform = new Platform(getInputLines(filepath));
  // NB: 1000 is working instead of 1000000000
  for (let i = 0; i < 1000; i++) {
    platform.tiltCycle();
  }
  return platform.getNorthBeamsLoad();
}
