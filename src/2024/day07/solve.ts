import { getInputLines, sum } from '#utils/index.js';
import { checkCalibrationEquation, parseCalibrationEquations } from './calibration.js';

export function solvePart1(filepath: string) {
  const calibrations = parseCalibrationEquations(getInputLines(filepath));
  const validTestValues = calibrations
    .filter((calibration) => checkCalibrationEquation(calibration, false))
    .map(({ testValue }) => testValue);
  return sum(validTestValues);
}

export function solvePart2(filepath: string) {
  const calibrations = parseCalibrationEquations(getInputLines(filepath));
  const validTestValues = calibrations
    .filter((calibration) => checkCalibrationEquation(calibration, true))
    .map(({ testValue }) => testValue);
  return sum(validTestValues);
}
