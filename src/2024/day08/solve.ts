import { getInputLines } from '#utils/index.js';
import { AntennaMap } from './antennas.js';

export function solvePart1(filepath: string) {
  const map = AntennaMap.parse(getInputLines(filepath));
  return map.findAntinodeLocations(false).length;
}

export function solvePart2(filepath: string) {
  const map = AntennaMap.parse(getInputLines(filepath));
  return map.findAntinodeLocations(true).length;
}
