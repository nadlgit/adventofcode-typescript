type SquareType = '.' | 'O' | '#';

export class Platform {
  private readonly nbRows: number;
  private readonly nbCols: number;
  private squares: { value: SquareType }[][];

  constructor(readonly lines: string[]) {
    this.nbRows = lines.length;
    this.nbCols = lines[0].length;
    this.squares = lines.map((line) =>
      line.split('').map((char) => ({ value: char as SquareType }))
    );
  }

  toStringLines(): string[] {
    return this.squares.map((list) => list.map(({ value }) => value).join(''));
  }

  tiltNorth() {
    for (let c = 0; c < this.nbCols; c++) {
      this.tiltLineLeft(this.getColumn(c));
    }
  }

  tiltWest() {
    for (let r = 0; r < this.nbRows; r++) {
      this.tiltLineLeft(this.squares[r]);
    }
  }

  tiltSouth() {
    for (let c = 0; c < this.nbCols; c++) {
      this.tiltLineLeft([...this.getColumn(c)].reverse());
    }
  }

  tiltEast() {
    for (let r = 0; r < this.nbRows; r++) {
      this.tiltLineLeft([...this.squares[r]].reverse());
    }
  }

  tiltCycle() {
    this.tiltNorth();
    this.tiltWest();
    this.tiltSouth();
    this.tiltEast();
  }

  getNorthBeamsLoad(): number {
    let totalLoad = 0;
    for (let c = 0; c < this.nbCols; c++) {
      for (let r = 0; r < this.nbRows; r++) {
        if (this.squares[r][c].value === 'O') {
          totalLoad += this.nbRows - r;
        }
      }
    }
    return totalLoad;
  }

  private getColumn(c: number): (typeof this.squares)[number] {
    const column: (typeof this.squares)[number] = [];
    for (let r = 0; r < this.nbRows; r++) {
      column.push(this.squares[r][c]);
    }
    return column;
  }

  private tiltLineLeft(line: (typeof this.squares)[number]) {
    let lastIdx = -1;
    for (let i = 0; i < line.length; i++) {
      if (line[i].value === '#') {
        lastIdx = i;
      } else if (line[i].value === 'O') {
        lastIdx++;
        line[i].value = '.';
        line[lastIdx].value = 'O';
      }
    }
  }
}
