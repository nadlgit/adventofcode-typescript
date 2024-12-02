export function parseReport(line: string): number[] {
  return line.split(' ').map((n) => Number.parseInt(n));
}

export function isSafeReport(report: number[], allowBadLevel = false): boolean {
  const reportMinusSingleLevelList = allowBadLevel
    ? report.map((_, idx) => [...report.slice(0, idx), ...report.slice(idx + 1)])
    : [];
  return isSafe(report) || reportMinusSingleLevelList.some(isSafe);
}

function isSafe(report: number[]) {
  const isIncreasing = report.every((level, idx) => idx === 0 || level > report[idx - 1]);
  const isDecreasing = report.every((level, idx) => idx === 0 || level < report[idx - 1]);
  const hasValidDiff = report.every(
    (level, idx) => idx === 0 || Math.abs(level - report[idx - 1]) <= 3
  );
  return (isIncreasing || isDecreasing) && hasValidDiff;
}
