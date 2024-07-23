import { multiply } from '#utils/index.js';

type Position = [number, number];
type Direction = 'left' | 'right' | 'up' | 'down';

export class TreeMap {
  public readonly grid: Readonly<Readonly<number[]>[]>;
  public readonly nbRows: number;
  public readonly nbCols: number;
  private readonly columns: Readonly<Readonly<number[]>[]>;

  constructor(lines: string[]) {
    this.grid = lines
      .filter((line) => line.length > 0)
      .map((line) => line.split('').map((n) => Number.parseInt(n)));
    this.nbRows = this.grid.length;
    this.nbCols = this.grid.length > 0 ? this.grid[0].length : 0;
    this.columns = Array.from(new Array(this.nbCols), (_, cIdx) =>
      Array.from(new Array(this.nbRows), (_, rIdx) => this.grid[rIdx][cIdx])
    );
  }

  isTreeVisibleFromOutside([row, col]: Position): boolean {
    const height = this.grid[row][col];
    for (const trees of Object.values(this.getTreesToEdges([row, col]))) {
      if (trees.every((treeHeight) => treeHeight < height)) {
        return true;
      }
    }
    return false;
  }

  getTreeViewingDistances([row, col]: Position): Record<Direction, number> {
    const height = this.grid[row][col];
    const treesToEdges = this.getTreesToEdges([row, col]);
    const distances = { left: 0, right: 0, up: 0, down: 0 };
    for (const direction of Object.keys(distances) as Direction[]) {
      for (const treeHeight of treesToEdges[direction]) {
        distances[direction]++;
        if (treeHeight >= height) {
          break;
        }
      }
    }
    return distances;
  }

  getTreeScenicScore([row, col]: Position): number {
    return multiply(Object.values(this.getTreeViewingDistances([row, col])));
  }

  private getTreesToEdges([row, col]: Position): Record<Direction, number[]> {
    return {
      left: this.grid[row].slice(0, col).reverse(),
      right: this.grid[row].slice(col + 1),
      up: this.columns[col].slice(0, row).reverse(),
      down: this.columns[col].slice(row + 1),
    };
  }
}
