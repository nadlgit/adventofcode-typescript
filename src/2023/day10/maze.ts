import { shoelaceArea } from '#utils/index.js';

type PipeCharacter = '-' | '|' | 'F' | '7' | 'L' | 'J' | 'S';
type Direction = 'left' | 'right' | 'top' | 'bottom';
type Position = [number, number];

export class Maze {
  constructor(private readonly sketch: string[]) {}

  getConnectedPipes([rowIdx, colIdx]: Position): Position[] {
    const connectedPipes: Position[] = [];
    const pipeConnections: Record<PipeCharacter, Partial<Record<Direction, PipeCharacter[]>>> = {
      '-': { left: ['-', 'F', 'L', 'S'], right: ['-', '7', 'J', 'S'] },
      '|': { top: ['|', 'F', '7', 'S'], bottom: ['|', 'L', 'J', 'S'] },
      F: { right: ['-', '7', 'J', 'S'], bottom: ['|', 'L', 'J', 'S'] },
      '7': { left: ['-', 'F', 'L', 'S'], bottom: ['|', 'L', 'J', 'S'] },
      L: { right: ['-', '7', 'J', 'S'], top: ['|', 'F', '7', 'S'] },
      J: { left: ['-', 'F', 'L', 'S'], top: ['|', 'F', '7', 'S'] },
      S: {
        left: ['-', 'F', 'L'],
        right: ['-', '7', 'J'],
        top: ['|', 'F', '7'],
        bottom: ['|', 'L', 'J'],
      },
    };

    const adjacentPositions: Record<Direction, Position> = {
      left: [rowIdx, colIdx - 1],
      right: [rowIdx, colIdx + 1],
      top: [rowIdx - 1, colIdx],
      bottom: [rowIdx + 1, colIdx],
    };
    for (const [direction, connections] of Object.entries(
      pipeConnections[this.sketch[rowIdx][colIdx] as PipeCharacter]
    ) as [Direction, PipeCharacter[]][]) {
      const [r, c] = adjacentPositions[direction];
      if (
        r >= 0 &&
        r < this.sketch.length &&
        c >= 0 &&
        c < this.sketch[0].length &&
        connections.includes(this.sketch[r][c] as PipeCharacter)
      ) {
        connectedPipes.push([r, c]);
      }
    }

    return connectedPipes;
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
