import { type AdjacentPosition, getAdjacentPositions, shoelaceArea } from '#utils/index.js';

type PipeCharacter = '-' | '|' | 'F' | '7' | 'L' | 'J' | 'S';
type Position = [number, number];

export class Maze {
  constructor(private readonly sketch: string[]) {}

  getConnectedPipes([rowIdx, colIdx]: Position): Position[] {
    const pipeConnections: Record<
      PipeCharacter,
      Partial<Record<AdjacentPosition['direction'], PipeCharacter[]>>
    > = {
      '-': { left: ['-', 'F', 'L', 'S'], right: ['-', '7', 'J', 'S'] },
      '|': { up: ['|', 'F', '7', 'S'], down: ['|', 'L', 'J', 'S'] },
      F: { right: ['-', '7', 'J', 'S'], down: ['|', 'L', 'J', 'S'] },
      '7': { left: ['-', 'F', 'L', 'S'], down: ['|', 'L', 'J', 'S'] },
      L: { right: ['-', '7', 'J', 'S'], up: ['|', 'F', '7', 'S'] },
      J: { left: ['-', 'F', 'L', 'S'], up: ['|', 'F', '7', 'S'] },
      S: {
        left: ['-', 'F', 'L'],
        right: ['-', '7', 'J'],
        up: ['|', 'F', '7'],
        down: ['|', 'L', 'J'],
      },
    };
    return getAdjacentPositions({
      row: rowIdx,
      col: colIdx,
      filter: {
        rowMin: 0,
        rowMax: this.sketch.length - 1,
        colMin: 0,
        colMax: this.sketch[0].length - 1,
      },
    })
      .filter(({ direction, row, col }) =>
        pipeConnections[this.sketch[rowIdx][colIdx] as PipeCharacter][direction]?.includes(
          this.sketch[row][col] as PipeCharacter
        )
      )
      .map(({ row, col }) => [row, col] as Position);
  }

  detectLoopBoundary(): Position[] {
    const boundaryTiles: Position[] = [];
    const startRowIdx = this.sketch.findIndex((row) => row.includes('S'));
    const startColIdx = startRowIdx >= 0 ? this.sketch[startRowIdx].indexOf('S') : -1;
    let currentTile: Position | null =
      startRowIdx >= 0 && startColIdx >= 0 ? [startRowIdx, startColIdx] : null;
    while (currentTile) {
      boundaryTiles.push(currentTile);
      const nextPipes: Position[] = this.getConnectedPipes(currentTile).filter(([rowIdx, colIdx]) =>
        boundaryTiles.every(([r, c]) => r !== rowIdx || c !== colIdx)
      );
      currentTile = nextPipes.length > 0 ? nextPipes[0] : null;
    }
    return boundaryTiles;
  }

  isVertex([rowIdx, colIdx]: Position): boolean {
    const connectedPipes = this.getConnectedPipes([rowIdx, colIdx]);
    return (
      connectedPipes.length === 2 &&
      connectedPipes[0][0] !== connectedPipes[1][0] &&
      connectedPipes[0][1] !== connectedPipes[1][1]
    );
  }
}

export function countLoopFarthestSteps(maze: Maze): number {
  const loopBoundary = maze.detectLoopBoundary();
  return loopBoundary.length / 2;
}

export function countLoopTilesEnclosed(maze: Maze): number {
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  const loopBoundary = maze.detectLoopBoundary();
  const loopVertices = loopBoundary.filter((tile) => maze.isVertex(tile));
  const loopArea = shoelaceArea(loopVertices);
  const loopInteriorTiles = loopArea - loopBoundary.length / 2 + 1;
  return loopInteriorTiles;
}
