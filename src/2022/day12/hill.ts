import { getAdjacentPositions, isEqualObject, PriorityQueue, QueueItemsSet } from '#utils/index.js';

type Position = [number, number];

export class HillMap {
  readonly grid: Readonly<Readonly<number[]>[]>;
  readonly start: Readonly<Position>;
  readonly end: Readonly<Position>;
  readonly allStarts: Readonly<Readonly<Position>[]>;

  constructor(lines: string[]) {
    const startRow = lines.findIndex((line) => line.includes('S'));
    const startCol = startRow >= 0 ? lines[startRow].indexOf('S') : -1;
    this.start = [startRow, startCol];

    const endRow = lines.findIndex((line) => line.includes('E'));
    const endCol = endRow >= 0 ? lines[endRow].indexOf('E') : -1;
    this.end = [endRow, endCol];

    this.grid = lines.map((line) =>
      line.split('').map((char) => char.replace('S', 'a').replace('E', 'z').charCodeAt(0))
    );

    this.allStarts = this.grid.flatMap((row, rIdx) =>
      row.reduce<Position[]>((acc, value, cIdx) => {
        if (value === 'a'.charCodeAt(0)) acc.push([rIdx, cIdx]);
        return acc;
      }, [])
    );
  }

  findPossibleNextSteps([row, col]: Position): Position[] {
    return getAdjacentPositions({
      row,
      col,
      filter: {
        rowMin: 0,
        rowMax: this.grid.length - 1,
        colMin: 0,
        colMax: this.grid.length > 0 ? this.grid[0].length - 1 : 0,
      },
    })
      .filter(
        ({ direction, row: r, col: c }) =>
          ['left', 'right', 'up', 'down'].includes(direction) &&
          this.grid[r][c] <= this.grid[row][col] + 1
      )
      .map(({ row, col }) => [row, col]);
  }
}

class PathSteps {
  private readonly steps: Record<string, number> = {};

  insert(from: Position, to: Position): void {
    this.steps[JSON.stringify(to)] = this.get(from) + 1;
  }

  get(position: Position): number {
    return this.steps[JSON.stringify(position)] ?? 0;
  }
}

function findFewestStepsFromPosition(hill: HillMap, origin: Position): number {
  let fewestSteps = Number.MAX_SAFE_INTEGER;
  const steps = new PathSteps();
  const pathOpenList = new PriorityQueue([origin], (position) => steps.get(position));
  const positionSet = new QueueItemsSet([origin]);
  while (pathOpenList.size > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const position = pathOpenList.dequeue()!;
    if (steps.get(position) >= fewestSteps) {
      continue;
    }
    if (isEqualObject(position, hill.end)) {
      fewestSteps = Math.min(steps.get(position), fewestSteps);
      continue;
    }
    for (const nextPosition of hill
      .findPossibleNextSteps(position)
      .filter((pos) => !positionSet.has(pos))) {
      steps.insert(position, nextPosition);
      pathOpenList.enqueue(nextPosition);
      positionSet.add(nextPosition);
    }
  }
  return fewestSteps;
}

export function findFewestStepsFromStart(hill: HillMap): number {
  return findFewestStepsFromPosition(hill, [...hill.start]);
}

export function findFewestStepsFromAllStarts(hill: HillMap): number {
  return Math.min(...hill.allStarts.map((start) => findFewestStepsFromPosition(hill, [...start])));
}
