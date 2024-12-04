export class WordSearch {
  private readonly grid: string[][];
  private readonly nbRows: number;
  private readonly nbCols: number;

  constructor(public lines: string[]) {
    this.grid = lines.filter((line) => line.length > 0).map((line) => line.split(''));
    this.nbRows = this.grid.length;
    this.nbCols = this.grid.length > 0 ? this.grid[0].length : 0;
  }

  countXmas(): number {
    let count = 0;
    for (let r = 0; r < this.nbRows; r++) {
      for (let c = 0; c < this.nbCols; c++) {
        for (const direction of [
          'right',
          'left',
          'down',
          'up',
          'downright',
          'upleft',
          'downleft',
          'upright',
        ] as const) {
          if (this.isSearchedWord('XMAS', [r, c], direction)) {
            count++;
          }
        }
      }
    }
    return count;
  }

  countCrossMas(): number {
    let count = 0;
    for (let r = 1; r < this.nbRows - 1; r++) {
      for (let c = 1; c < this.nbCols - 1; c++) {
        if (
          this.grid[r][c] === 'A' &&
          (this.isSearchedWord('MAS', [r - 1, c - 1], 'downright') ||
            this.isSearchedWord('MAS', [r + 1, c + 1], 'upleft')) &&
          (this.isSearchedWord('MAS', [r - 1, c + 1], 'downleft') ||
            this.isSearchedWord('MAS', [r + 1, c - 1], 'upright'))
        ) {
          count++;
        }
      }
    }
    return count;
  }

  private isSearchedWord(
    searchedWord: string,
    [startRow, startCol]: [number, number],
    direction: 'left' | 'right' | 'up' | 'down' | 'upleft' | 'upright' | 'downleft' | 'downright'
  ) {
    let row = startRow;
    let col = startCol;
    let i = 0;
    while (
      i < searchedWord.length &&
      row >= 0 &&
      row < this.nbRows &&
      col >= 0 &&
      col < this.nbCols &&
      this.grid[row][col] === searchedWord[i]
    ) {
      i++;
      row += {
        left: 0,
        right: 0,
        up: -1,
        down: 1,
        upleft: -1,
        upright: -1,
        downleft: 1,
        downright: 1,
      }[direction];
      col += {
        left: -1,
        right: 1,
        up: 0,
        down: 0,
        upleft: -1,
        upright: 1,
        downleft: -1,
        downright: 1,
      }[direction];
    }
    return i === searchedWord.length;
  }
}
