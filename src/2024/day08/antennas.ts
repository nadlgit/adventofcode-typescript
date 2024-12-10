import { ObjectSet } from '#utils/index.js';

export class AntennaMap {
  private readonly antennasByFrequency: Record<string, { row: number; col: number }[]>;
  private readonly antennaPairs: {
    row1: number;
    col1: number;
    row2: number;
    col2: number;
  }[];

  constructor(
    private readonly nbRows: number,
    private readonly nbCols: number,
    antennas: {
      frequency: string;
      row: number;
      col: number;
    }[]
  ) {
    this.antennasByFrequency = antennas.reduce<typeof this.antennasByFrequency>(
      (acc, { frequency, row, col }) => {
        acc[frequency] = acc[frequency] ?? [];
        acc[frequency].push({ row, col });
        return acc;
      },
      {}
    );
    this.antennaPairs = Object.values(this.antennasByFrequency).flatMap((positions) =>
      positions.reduce<typeof this.antennaPairs>((acc, { row: row1, col: col1 }, idx1) => {
        for (let idx2 = idx1 + 1; idx2 < positions.length; idx2++) {
          const { row: row2, col: col2 } = positions[idx2];
          acc.push({ row1, col1, row2, col2 });
        }
        return acc;
      }, [])
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
    const antinodes = ignoreDistance
      ? this.antennaPairs.reduce<ObjectSet<{ row: number; col: number }>>(
          (acc, { row1, col1, row2, col2 }) => {
            for (let row = 0; row < this.nbRows; row++) {
              // a*x + b*y + c = 0
              const a = col2 - col1;
              const b = row1 - row2;
              const c = -a * row1 - b * col1;
              const col = -(a * row + c) / b;
              if (this.isValidPosition({ row, col })) {
                acc.add({ row, col });
              }
            }
            return acc;
          },
          new ObjectSet()
        )
      : this.antennaPairs.reduce<ObjectSet<{ row: number; col: number }>>(
          (acc, { row1, col1, row2, col2 }) => {
            for (const { row, col } of [
              { row: 2 * row1 - row2, col: 2 * col1 - col2 },
              { row: 2 * row2 - row1, col: 2 * col2 - col1 },
            ]) {
              if (this.isValidPosition({ row, col })) {
                acc.add({ row, col });
              }
            }
            return acc;
          },
          new ObjectSet()
        );
    return antinodes.values();
  }

  private isValidPosition({ row, col }: { row: number; col: number }): boolean {
    return (
      Number.isInteger(row) &&
      row >= 0 &&
      row < this.nbRows &&
      Number.isInteger(col) &&
      col >= 0 &&
      col < this.nbCols
    );
  }
}
