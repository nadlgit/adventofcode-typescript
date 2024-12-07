export function parseLabInput(lines: string[]): { map: LabMap; guardStart: GuardPosition } {
  const nbRows = lines.filter((line) => line.length > 0).length;
  const nbCols = nbRows > 0 ? lines[0].length : 0;
  const obstacles = lines.reduce<{ row: number; col: number }[]>((acc, line, row) => {
    for (let col = 0; col < line.length; col++) {
      if (line[col] === '#') {
        acc.push({ row, col });
      }
    }
    return acc;
  }, []);
  const guardRow = lines.findIndex((line) => line.includes('^'));
  const guardCol = lines[guardRow].indexOf('^');
  return {
    map: new LabMap(nbRows, nbCols, obstacles),
    guardStart: { row: guardRow, col: guardCol, direction: 'up' },
  };
}

export type GuardPosition = Readonly<{
  row: number;
  col: number;
  direction: 'up' | 'down' | 'left' | 'right';
}>;

export class LabMap {
  constructor(
    private readonly nbRows: number,
    private readonly nbCols: number,
    private readonly obstacles: ReadonlyArray<Readonly<{ row: number; col: number }>>
  ) {}

  findGuardNextPosition({ row, col, direction }: GuardPosition): GuardPosition | null {
    const forwardRow =
      row +
      {
        up: -1,
        down: 1,
        left: 0,
        right: 0,
      }[direction];
    const forwardCol =
      col +
      {
        up: 0,
        down: 0,
        left: -1,
        right: 1,
      }[direction];
    const turnDirection = {
      up: 'right',
      right: 'down',
      down: 'left',
      left: 'up',
    }[direction] as GuardPosition['direction'];

    if (this.isOutOfMap(forwardRow, forwardCol)) {
      return null;
    }
    if (this.isObstacle(forwardRow, forwardCol)) {
      return { row, col, direction: turnDirection };
    }
    return { row: forwardRow, col: forwardCol, direction };
  }

  cloneWithExtraObstacle(obstacle: { row: number; col: number }): LabMap {
    return new LabMap(this.nbRows, this.nbCols, [...this.obstacles, obstacle]);
  }

  private isOutOfMap(row: number, col: number) {
    return row < 0 || row >= this.nbRows || col < 0 || col >= this.nbCols;
  }

  private isObstacle(row: number, col: number) {
    return !!this.obstacles.find((obstacle) => obstacle.row === row && obstacle.col === col);
  }
}

export function findGuardPath(
  map: LabMap,
  guardStart: GuardPosition
): { distinctPositions: { row: number; col: number }[]; isLoop: boolean } {
  const visited = new Set<string>();
  const makeSetKey = ({ row, col, direction }: GuardPosition) =>
    JSON.stringify({ row, col }) + '|' + direction;
  let guard: GuardPosition | null = guardStart;
  while (guard !== null && !visited.has(makeSetKey(guard))) {
    visited.add(makeSetKey(guard));
    guard = map.findGuardNextPosition(guard);
  }

  const visitedDistinct = new Set([...visited].map((str) => str.split('|')[0]));
  const distinctPositions = [...visitedDistinct].map(
    (str) => JSON.parse(str) as { row: number; col: number }
  );
  const isLoop = guard !== null;
  return { distinctPositions, isLoop };
}

export function countGuardDistinctPositions(map: LabMap, guardStart: GuardPosition): number {
  const { distinctPositions } = findGuardPath(map, guardStart);
  return distinctPositions.length;
}

export function countPossibleObstructions(map: LabMap, guardStart: GuardPosition): number {
  let count = 0;
  const { distinctPositions } = findGuardPath(map, guardStart);
  for (const { row, col } of distinctPositions) {
    if (row !== guardStart.row || col !== guardStart.col) {
      const { isLoop } = findGuardPath(map.cloneWithExtraObstacle({ row, col }), guardStart);
      if (isLoop) {
        count++;
      }
    }
  }
  return count;
}
