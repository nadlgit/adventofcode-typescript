import { getInputLines } from '#utils/index.js';
import {
  countRowImpossibleBeacons,
  findDistressBeacon,
  parseSensorReport,
} from './sensor-system.js';

export function solvePart1(filepath: string) {
  const sensors = parseSensorReport(getInputLines(filepath));
  const y = filepath.includes('example-input.txt') ? 10 : 2000000;
  return countRowImpossibleBeacons(sensors, y);
}

export function solvePart2(filepath: string) {
  const sensors = parseSensorReport(getInputLines(filepath));
  const coordinateMax = filepath.includes('example-input.txt') ? 20 : 4000000;
  const { x, y } = findDistressBeacon(sensors, coordinateMax);
  return x * 4000000 + y;
}
