import { getInputLines, sum } from '#utils/index.js';
import { decodeCalibration, decodeSpelledCalibration } from './decode-calibration.js';

export function solvePart1(filepath: string) {
  const calibrations = getInputLines(filepath).map((line) => decodeCalibration(line));
  return sum(calibrations);
}

export function solvePart2(filepath: string) {
  const calibrations = getInputLines(filepath).map((line) => decodeSpelledCalibration(line));
  return sum(calibrations);
}
