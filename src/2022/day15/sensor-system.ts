import { manhattanDistance, sum } from '#utils/index.js';

type Position = { x: number; y: number };
type Sensor = { position: Position; closestBeacon: Position; distance: number };
type Range = [number, number];

export function parseSensorReport(lines: string[]): Sensor[] {
  return lines
    .filter((line) => line.length > 0)
    .map((line) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { sx, sy, bx, by } = line.match(
        /Sensor at x=(?<sx>-*\d+), y=(?<sy>-*\d+): closest beacon is at x=(?<bx>-*\d+), y=(?<by>-*\d+)/
      )!.groups!;
      const position = { x: Number.parseInt(sx), y: Number.parseInt(sy) };
      const closestBeacon = { x: Number.parseInt(bx), y: Number.parseInt(by) };
      const distance = manhattanDistance(
        [position.x, position.y],
        [closestBeacon.x, closestBeacon.y]
      );
      return { position, closestBeacon, distance };
    });
}

export function findSensorRowCoverage(
  { position, closestBeacon, distance }: Sensor,
  y: number
): Range | null {
  const remainingDistance = distance - Math.abs(y - position.y);
  let xStart = position.x - remainingDistance;
  let xEnd = position.x + remainingDistance;
  if (y === closestBeacon.y) {
    if (closestBeacon.x === xStart) {
      xStart += 1;
    }
    if (closestBeacon.x === xEnd) {
      xEnd -= 1;
    }
  }
  return xStart > xEnd ? null : [xStart, xEnd];
}

export function findSortedRowFilledColumns(
  sensors: Sensor[],
  y: number,
  includeBeacons: boolean
): Range[] {
  const ranges: Range[] = [];
  for (const sensor of sensors) {
    const coverage = findSensorRowCoverage(sensor, y);
    if (coverage) {
      ranges.push(coverage);
    }
    if (includeBeacons && sensor.closestBeacon.y === y) {
      ranges.push([sensor.closestBeacon.x, sensor.closestBeacon.x]);
    }
  }
  const mergedRanges: Range[] = [];
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
    const [prevStart, prevEnd] = mergedRanges.pop() ?? [start, end];
    if (prevEnd < start - 1) {
      mergedRanges.push([prevStart, prevEnd], [start, end]);
    } else {
      mergedRanges.push([prevStart, Math.max(prevEnd, end)]);
    }
  }
  return mergedRanges;
}

export function countRowImpossibleBeacons(sensors: Sensor[], y: number): number {
  const xRanges = findSortedRowFilledColumns(sensors, y, false);
  return sum(xRanges.map(([start, end]) => end - start + 1));
}

export function findMissingRanges(ranges: Range[]): Range[] {
  const missingList: Range[] = [];
  for (let i = 1; i < ranges.length; i++) {
    const start = ranges[i - 1][1] + 1;
    const end = ranges[i][0] - 1;
    if (start <= end) {
      missingList.push([start, end]);
    }
  }
  return missingList;
}

export function findDistressBeacon(sensors: Sensor[], coordinateMax: number): Position {
  const coordinateMin = 0;
  const xMin = Math.max(
    coordinateMin,
    Math.min(...sensors.map(({ position, distance }) => position.x - distance))
  );
  const xMax = Math.min(
    coordinateMax,
    Math.max(...sensors.map(({ position, distance }) => position.x + distance))
  );
  const yMin = Math.max(
    coordinateMin,
    Math.min(...sensors.map(({ position, distance }) => position.y - distance))
  );
  const yMax = Math.min(
    coordinateMax,
    Math.max(...sensors.map(({ position, distance }) => position.y + distance))
  );
  for (let y = yMin; y <= yMax; y++) {
    const xRanges = findSortedRowFilledColumns(sensors, y, true).filter(
      ([start, end]) => end >= xMin || start <= xMax
    );
    const missing = findMissingRanges(xRanges);
    if (missing.length === 1 && missing[0][0] === missing[0][1]) {
      return { x: missing[0][0], y };
    }
  }
  return { x: -1, y: -1 };
}
