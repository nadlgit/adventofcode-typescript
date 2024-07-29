import {
  findQuadraticEquationFromPoints,
  getAdjacentPositions,
  ObjectSet,
  translateDimension,
} from '#utils/index.js';

type Position = { row: number; col: number };

export class Garden {
  public readonly nbRows: number;
  public readonly nbCols: number;
  public readonly startPosition: Position;

  constructor(private readonly mapLines: string[]) {
    this.nbRows = mapLines.length;
    this.nbCols = mapLines.length > 0 ? mapLines[0].length : 0;

    const startRow = mapLines.findIndex((line) => line.includes('S'));
    const startCol = startRow >= 0 ? mapLines[startRow].indexOf('S') : -1;
    this.startPosition = { row: startRow, col: startCol };
  }

  getSingleStepReachablePlots({ row, col }: Position): Position[] {
    return getAdjacentPositions({ row, col })
      .filter(
        ({ direction, row, col }) =>
          ['left', 'right', 'up', 'down'].includes(direction) &&
          this.mapLines[this.translateRow(row)][this.translateCol(col)] !== '#'
      )
      .map(({ row, col }) => ({ row, col }));
  }

  private translateRow = (row: number) => translateDimension(row, this.nbRows);

  private translateCol = (col: number) => translateDimension(col, this.nbCols);
}

export function findReachablePlots(garden: Garden, steps: number): Position[] {
  const reachablePlots = new Set<string>();
  const queue = [{ currPosition: garden.startPosition, currSteps: steps }];
  const queueSet = new ObjectSet(queue);
  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { currPosition, currSteps } = queue.shift()!;
    if (currSteps < 1) {
      reachablePlots.add(JSON.stringify(currPosition));
    } else {
      for (const plot of garden
        .getSingleStepReachablePlots(currPosition)
        .map((pos) => ({ currPosition: pos, currSteps: currSteps - 1 }))
        .filter((plot) => !queueSet.has(plot))) {
        queue.push(plot);
        queueSet.add(plot);
      }
    }
  }
  return [...reachablePlots].map((str) => JSON.parse(str) as Position);
}

export function countReachablePlots(garden: Garden, steps: number): number {
  let reachablePlots = steps % 2 === 0 ? 1 : 0;
  const queue = [garden.startPosition];
  const queueSet = new ObjectSet(queue);
  for (let i = 0; i < steps; i++) {
    const currPositions = queue.splice(0);
    for (const position of currPositions) {
      for (const plot of garden
        .getSingleStepReachablePlots(position)
        .filter((plot) => !queueSet.has(plot))) {
        queue.push(plot);
        queueSet.add(plot);
      }
    }
    if ((i + 1) % 2 === steps % 2) {
      reachablePlots += queue.length;
    }
  }
  return reachablePlots;
}

export function specificCountReachablePlots(garden: Garden, steps: number): number {
  /*
  Reddit tips: https://www.reddit.com/r/adventofcode/comments/18nevo3/2023_day_21_solutions/
  Input has specific characteristics:
    - map slice is a square
    - edges are filled with plots, no rocks
    - start point lines are filled with plots, no rocks
  And: 26501365 = 202300 * 131 + 65, where 131 is square side length and 65 is min steps from start to edge
  Don't know why but given that, solution fits a quadratic equation:
    - reachablePlots = ax² + bx + c
    - where: steps = side * x + edgeSteps => x = (steps - edgeSteps) / side
  */
  const side = garden.nbRows;
  const edgeSteps = (side - 1) / 2;
  if (steps <= edgeSteps) {
    return countReachablePlots(garden, steps);
  }
  const point = (x: number): [number, number] => [
    x,
    countReachablePlots(garden, x * side + edgeSteps),
  ];
  const { a, b, c } = findQuadraticEquationFromPoints(point(0), point(1), point(2));
  const x = (steps - edgeSteps) / side;
  return a * x ** 2 + b * x + c;
}
