import { getAdjacentPositions } from '#utils/index.js';

type GridTileType = '.' | '|' | '-' | '/' | '\\';

type Position = { row: number; col: number };

type Direction = 'left' | 'right' | 'up' | 'down';

export type LightBeamHead = Position & { directionTo: Direction };

export class EnergyGrid {
  private readonly grid: GridTileType[][];

  constructor(gridLines: string[]) {
    this.grid = gridLines.map((line) => line.split('') as GridTileType[]);
  }

  get sideLength() {
    return this.grid.length;
  }

  getBeamEnterings(): LightBeamHead[] {
    const enterings: LightBeamHead[] = [];
    for (let i = 0; i < this.sideLength; i++) {
      enterings.push(
        { row: 0, col: i, directionTo: 'down' },
        { row: i, col: 0, directionTo: 'right' },
        { row: i, col: this.sideLength - 1, directionTo: 'left' },
        { row: this.sideLength - 1, col: i, directionTo: 'up' }
      );
    }
    return enterings;
  }

  findNextBeamHeads({ row, col, directionTo }: LightBeamHead): LightBeamHead[] {
    return this.findNextDirections(this.grid[row][col], directionTo).reduce<LightBeamHead[]>(
      (acc, curr) => {
        const position = getAdjacentPositions({
          row,
          col,
          filter: {
            rowMin: 0,
            rowMax: this.sideLength - 1,
            colMin: 0,
            colMax: this.sideLength - 1,
          },
        }).find(({ direction }) => direction === curr);
        if (position) {
          acc.push({ row: position.row, col: position.col, directionTo: curr });
        }
        return acc;
      },
      []
    );
  }

  private findNextDirections(tile: GridTileType, direction: Direction): Direction[] {
    const nextDirections: Direction[] = [];
    if (tile === '.') {
      nextDirections.push(direction);
    }
    if (tile === '/' && direction === 'left') {
      nextDirections.push('down');
    }
    if (tile === '/' && direction === 'right') {
      nextDirections.push('up');
    }
    if (tile === '/' && direction === 'up') {
      nextDirections.push('right');
    }
    if (tile === '/' && direction === 'down') {
      nextDirections.push('left');
    }
    if (tile === '\\' && direction === 'left') {
      nextDirections.push('up');
    }
    if (tile === '\\' && direction === 'right') {
      nextDirections.push('down');
    }
    if (tile === '\\' && direction === 'up') {
      nextDirections.push('left');
    }
    if (tile === '\\' && direction === 'down') {
      nextDirections.push('right');
    }
    if (tile === '|' && (direction === 'left' || direction === 'right')) {
      nextDirections.push('up', 'down');
    }
    if (tile === '|' && (direction === 'up' || direction === 'down')) {
      nextDirections.push(direction);
    }
    if (tile === '-' && (direction === 'left' || direction === 'right')) {
      nextDirections.push(direction);
    }
    if (tile === '-' && (direction === 'up' || direction === 'down')) {
      nextDirections.push('left', 'right');
    }
    return nextDirections;
  }
}

export function countEnergizedTiles(grid: EnergyGrid, beamEntering: LightBeamHead): number {
  const tilesVisited: Direction[][][] = Array.from(new Array(grid.sideLength), () =>
    Array.from(new Array(grid.sideLength), () => [])
  );
  const pathOpenList = [beamEntering];
  while (pathOpenList.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { row, col, directionTo } = pathOpenList.shift()!;
    const visited = tilesVisited[row][col];
    if (!visited.includes(directionTo)) {
      visited.push(directionTo);
      pathOpenList.push(...grid.findNextBeamHeads({ row, col, directionTo }));
    }
  }
  return tilesVisited.flatMap((items) => items.filter((item) => item.length > 0)).length;
}
