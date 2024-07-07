import { isEqualObject, manhattanDistance } from '#utils/index.js';

type Direction = 'left' | 'right' | 'up' | 'down';

type Position = { row: number; col: number };

export type PathStep = Position & { directionTo: Direction; heatLoss: number };

type CrucibleType = 'basic' | 'ultra';

export class CityBlocks {
  private readonly grid: number[][];

  constructor(gridLines: string[]) {
    this.grid = gridLines.map((line) => line.split('').map((n) => Number.parseInt(n)));
  }

  get nbRows() {
    return this.grid.length;
  }

  get nbCols() {
    return this.grid.length > 0 ? this.grid[0].length : 0;
  }

  findPossibleNextSteps(
    { row, col, directionTo, heatLoss }: PathStep,
    crucibleType: CrucibleType
  ): PathStep[] {
    const steps: PathStep[] = [];
    const nextDirections: Direction[] =
      directionTo === 'left' || directionTo === 'right' ? ['up', 'down'] : ['left', 'right'];
    for (const direction of nextDirections) {
      let currentPosition = { row, col };
      let currentHeatLoss = heatLoss;
      let block;
      let i = 0;
      while (
        i < (crucibleType === 'ultra' ? 10 : 3) &&
        (block = this.getAdjacentBlock({ ...currentPosition, direction }))
      ) {
        currentPosition = block;
        currentHeatLoss += block.heatLoss;
        if (i >= (crucibleType === 'ultra' ? 3 : 0)) {
          steps.push({ ...currentPosition, directionTo: direction, heatLoss: currentHeatLoss });
        }
        i++;
      }
    }
    return steps;
  }

  private getAdjacentBlock({
    row,
    col,
    direction,
  }: Position & { direction: Direction }): (Position & { heatLoss: number }) | null {
    let position: Position | null = null;
    if (direction === 'left' && col > 0) {
      position = { row, col: col - 1 };
    }
    if (direction === 'right' && col < this.nbCols - 1) {
      position = { row, col: col + 1 };
    }
    if (direction === 'up' && row > 0) {
      position = { row: row - 1, col };
    }
    if (direction === 'down' && row < this.nbRows - 1) {
      position = { row: row + 1, col };
    }
    return position ? { ...position, heatLoss: this.grid[position.row][position.col] } : null;
  }
}

export function findPathLeastHeatLoss(city: CityBlocks, crucibleType: CrucibleType): number {
  const startPosition = { row: 0, col: 0 } as const;
  const endPosition = { row: city.nbRows - 1, col: city.nbCols - 1 } as const;
  let pathOpenList: PathStep[] = [
    { ...startPosition, directionTo: 'right', heatLoss: 0 },
    { ...startPosition, directionTo: 'down', heatLoss: 0 },
  ];
  let leastHeatLoss = Number.MAX_SAFE_INTEGER;
  const blocksVisitedHeatLoss: Record<Direction, number>[][] = Array.from(
    new Array(city.nbRows),
    () => Array.from(new Array(city.nbCols), () => ({} as Record<Direction, number>))
  );

  const isVisited = ({ row, col, directionTo, heatLoss }: PathStep) => {
    const visited = blocksVisitedHeatLoss[row][col][directionTo];
    return visited !== undefined && visited <= heatLoss;
  };

  const heuristic = ({ row, col, directionTo, heatLoss }: PathStep) => {
    const heatLossCriteria = heatLoss;
    const distanceCriteria = manhattanDistance([row, col], [endPosition.row, endPosition.col]);
    const directionCriteria = directionTo === 'right' || directionTo === 'down' ? 1 : 2;
    return distanceCriteria + 1000 * heatLossCriteria + 10000 * directionCriteria;
  };

  while (pathOpenList.length > 0) {
    const { row, col, directionTo, heatLoss } = pathOpenList.shift()!;

    if (!isVisited({ row, col, directionTo, heatLoss })) {
      blocksVisitedHeatLoss[row][col][directionTo] = heatLoss;
    }

    if (isEqualObject({ row, col }, endPosition)) {
      leastHeatLoss = Math.min(heatLoss, leastHeatLoss);
      continue;
    }

    pathOpenList = [
      ...pathOpenList,
      ...city.findPossibleNextSteps({ row, col, directionTo, heatLoss }, crucibleType),
    ]
      .filter((step) => step.heatLoss < leastHeatLoss && !isVisited(step))
      .sort((a, b) => heuristic(a) - heuristic(b));
  }

  return leastHeatLoss;
}
