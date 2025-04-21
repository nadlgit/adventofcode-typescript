import { getInputLines } from '#utils/index.js';
import { findPathReleasingMostPressure, parseValveNetwork } from './volcano.js';

export function solvePart1(filepath: string) {
  const valveNetwork = parseValveNetwork(getInputLines(filepath));
  const { pressureReleased } = findPathReleasingMostPressure(valveNetwork);
  return pressureReleased;
}

export function solvePart2(filepath: string) {
  return -1;
}
