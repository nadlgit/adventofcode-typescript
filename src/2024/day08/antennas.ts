export class AntennaMap {
  private readonly antennaPosition: Record<string, { row: number; col: number }[]>;

  constructor(
    private readonly nbRows: number,
    private readonly nbCols: number,
    antennas: {
      frequency: string;
      row: number;
      col: number;
    }[]
  ) {
    this.antennaPosition = antennas.reduce<typeof this.antennaPosition>(
      (acc, { frequency, row, col }) => {
        acc[frequency] = acc[frequency] ?? [];
        acc[frequency].push({ row, col });
        return acc;
      },
      {}
    );
  }

  static parse(lines: string[]): AntennaMap {
    const nbRows = lines.filter((line) => line.length > 0).length;
    const nbCols = nbRows > 0 ? lines[0].length : 0;
    const antennas: {
      frequency: string;
      row: number;
      col: number;
    }[] = [];
    for (let row = 0; row < nbRows; row++) {
      for (let col = 0; col < nbCols; col++) {
        const char = lines[row][col];
        if (char.match(/[a-zA-Z0-9]/)) {
          antennas.push({ frequency: char, row, col });
        }
      }
    }
    return new AntennaMap(nbRows, nbCols, antennas);
  }

  findAntinodeLocations(ignoreDistance: boolean): { row: number; col: number }[] {
    const antinodesStr = new Set<string>();
    for (let row0 = 0; row0 < this.nbRows; row0++) {
      for (let col0 = 0; col0 < this.nbCols; col0++) {
        for (const frequencyAntennaPositions of Object.values(this.antennaPosition)) {
          for (let i = 0; i < frequencyAntennaPositions.length; i++) {
            const { row: row1, col: col1 } = frequencyAntennaPositions[i];
            for (let j = i + 1; j < frequencyAntennaPositions.length; j++) {
              const { row: row2, col: col2 } = frequencyAntennaPositions[j];
              // a*x + b*y + c = 0
              const vectorRow = row2 - row1;
              const vectorCol = col2 - col1;
              const a = vectorCol;
              const b = -vectorRow;
              const c = -a * row1 - b * col1;
              const isAligned = a * row0 + b * col0 + c === 0;
              const hasRequiredDistance =
                (row0 === row1 - vectorRow && col0 === col1 - vectorCol) ||
                (row0 === row2 + vectorRow && col0 === col2 + vectorCol);
              if (isAligned && (ignoreDistance || hasRequiredDistance)) {
                antinodesStr.add(JSON.stringify({ row: row0, col: col0 }));
              }
            }
          }
        }
      }
    }
    const antinodes = [...antinodesStr].map(
      (str) => JSON.parse(str) as { row: number; col: number }
    );
    return antinodes;
  }
}
