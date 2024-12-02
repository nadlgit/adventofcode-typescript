import { handleInputLines } from '#utils/index.js';
import { isSafeReport, parseReport } from './check-reports.js';

export async function solvePart1(filepath: string) {
  const reports = await handleInputLines(filepath, parseReport);
  return reports.filter((report) => isSafeReport(report, false)).length;
}

export async function solvePart2(filepath: string) {
  const reports = await handleInputLines(filepath, parseReport);
  return reports.filter((report) => isSafeReport(report, true)).length;
}
