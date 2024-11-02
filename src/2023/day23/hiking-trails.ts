import { getAdjacentPositions } from '#utils/index.js';

type Position = { row: number; col: number };
type MapStep = Position & { tile: '.' | '^' | '>' | 'v' | '<' };
type GraphStep = Position & { distance: number };

const findMapStep = (
  map: MapStep[],
  {
    row,
    col,
  }:
    | Position
    | (Omit<Position, 'row'> & { row?: undefined })
    | (Omit<Position, 'col'> & { col?: undefined })
) =>
  map.find(
    (step) => (row === undefined || step.row === row) && (col === undefined || step.col === col)
  );

export function parseTrailsMap(lines: string[], groundState: 'slippery' | 'dry'): MapStep[] {
  return lines
    .filter((line) => line.trim().length > 0)
    .flatMap((line, row) =>
      line.split('').reduce<MapStep[]>((acc, c, col) => {
        if (c !== '#') {
          acc.push({
            row,
            col,
            tile: (groundState === 'dry' ? '.' : c) as MapStep['tile'],
          });
        }
        return acc;
      }, [])
    );
}

const slopeInfo = new Map([
  ['^', { direction: 'up', oppositeDirection: 'down' }],
  ['v', { direction: 'down', oppositeDirection: 'up' }],
  ['<', { direction: 'left', oppositeDirection: 'right' }],
  ['>', { direction: 'right', oppositeDirection: 'left' }],
]);

export function findAdjacentSteps(trailsMap: MapStep[], position: Position): GraphStep[] {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentSlopeInfo = slopeInfo.get(findMapStep(trailsMap, position)!.tile);
  return getAdjacentPositions(position).reduce<GraphStep[]>((acc, { row, col, direction }) => {
    const adjStep = findMapStep(trailsMap, { row, col });
    const adjSlopeInfo = adjStep && slopeInfo.get(adjStep.tile);
    if (
      adjStep &&
      ['up', 'down', 'left', 'right'].includes(direction) &&
      (!adjSlopeInfo || adjSlopeInfo.oppositeDirection !== direction) &&
      (!currentSlopeInfo || currentSlopeInfo.direction === direction)
    ) {
      acc.push({ row, col, distance: 1 });
    }
    return acc;
  }, []);
}

const nextAdjacents = (
  trailsMap: MapStep[],
  currPos: Position,
  { row: prevRow, col: prevCol }: Position
) =>
  findAdjacentSteps(trailsMap, currPos).filter(
    ({ row, col }) => row !== prevRow || col !== prevCol
  );

export function findStraightSteps(trailsMap: MapStep[], position: Position): GraphStep[] {
  const directAdjacents = findAdjacentSteps(trailsMap, position);
  if (directAdjacents.length === 2 || directAdjacents.length === 0) {
    return [];
  }
  return directAdjacents.map((current) => {
    let previous = { ...position };
    let adjacents = nextAdjacents(trailsMap, current, previous);
    while (adjacents.length === 1) {
      previous = { ...current };
      current.row = adjacents[0].row;
      current.col = adjacents[0].col;
      current.distance++;
      adjacents = nextAdjacents(trailsMap, current, previous);
    }
    return current;
  });
}

export class TrailsGraph {
  readonly start: Readonly<Position>;
  readonly end: Readonly<Position>;
  private readonly adjList: Map<string, { position: string; distance: number }[]>;

  constructor(lines: string[], groundState: 'slippery' | 'dry') {
    const trailsMap = parseTrailsMap(lines, groundState);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const start = findMapStep(trailsMap, { row: 0 })!;
    this.start = { row: start.row, col: start.col };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const end = findMapStep(trailsMap, { row: lines.length - 1 })!;
    this.end = { row: end.row, col: end.col };

    const findSteps = groundState === 'dry' ? findStraightSteps : findAdjacentSteps;
    this.adjList = new Map(
      trailsMap
        .map(
          ({ row, col }) =>
            [
              JSON.stringify({ row, col }),
              findSteps(trailsMap, { row, col }).map(({ row, col, distance }) => ({
                position: JSON.stringify({ row, col }),
                distance,
              })),
            ] as [string, { position: string; distance: number }[]]
        )
        .filter(([, steps]) => steps.length > 0)
    );
  }

  findLongestPathLength(): number {
    let longestPathLength = 0;
    const stack = [
      {
        current: JSON.stringify(this.start),
        visited: new Set<string>(),
        pathLength: 0,
      },
    ];
    const end = JSON.stringify(this.end);
    while (stack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { current, visited, pathLength } = stack.pop()!;

      if (current === end) {
        longestPathLength = Math.max(longestPathLength, pathLength);
        continue;
      }

      for (const { position, distance } of this.adjList.get(current) ?? []) {
        if (!visited.has(position)) {
          stack.push({
            current: position,
            visited: new Set(visited.add(current)),
            pathLength: pathLength + distance,
          });
        }
      }
    }
    return longestPathLength;
  }
}
