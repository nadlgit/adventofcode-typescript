import { handleInputLines, sum } from '#utils/index.js';
import { decodeCalibration, decodeSpelledCalibration } from './decode-calibration.js';

export async function solvePart1(filepath: string) {
  const calibrations = await handleInputLines(filepath, decodeCalibration);
  return sum(calibrations);
}

export async function solvePart2(filepath: string) {
  const calibrations = await handleInputLines(filepath, decodeSpelledCalibration);
  return sum(calibrations);
}
