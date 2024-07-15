import { manhattanDistance } from '#utils/index.js';

export type Universe = {
  nbRows: number;
  nbCols: number;
  galaxies: [number, number][];
  emptyRowsIndices: number[];
  emptyColsIndices: number[];
};

export function parseUniverse(lines: string[]): Universe {
  const nbRows = lines.length;
  const nbCols = lines.length > 0 ? lines[0].length : 0;
  const galaxies: [number, number][] = [];
  const emptyRowsIndices: number[] = [];
  const emptyColsIndices: number[] = [];
  const columns = new Array<string>(nbCols).fill('');
  for (let r = 0; r < nbRows; r++) {
    for (let c = 0; c < nbCols; c++) {
      const char = lines[r][c];
      if (char === '#') {
        galaxies.push([r, c]);
      }
      columns[c] += char;
    }
  }
  for (const { strList, emptyList } of [
    { strList: lines, emptyList: emptyRowsIndices },
    { strList: columns, emptyList: emptyColsIndices },
  ]) {
    for (let i = 0; i < strList.length; i++) {
      if (!strList[i].includes('#')) {
        emptyList.push(i);
      }
    }
  }
  return { nbRows, nbCols, galaxies, emptyRowsIndices, emptyColsIndices };
}

export function calcExpandedUniverseGalaxies(
  universe: Universe,
  expansionFactor: number
): [number, number][] {
  return universe.galaxies.map((galaxyPosition) => {
    const [r, c] = [universe.emptyRowsIndices, universe.emptyColsIndices].map(
      (emptyList, positionIdx) => {
        const coordIdx = galaxyPosition[positionIdx];
        return emptyList.reduce(
          (acc, emptyIdx) => (coordIdx > emptyIdx ? acc + Math.max(0, expansionFactor - 1) : acc),
          coordIdx
        );
      }
    );
    return [r, c];
  });
}

export function sumGalaxiesShortestPaths(universe: Universe, expansionFactor = 2): number {
  const galaxies = calcExpandedUniverseGalaxies(universe, expansionFactor);
  let sum = 0;
  for (let i1 = 0; i1 < galaxies.length; i1++) {
    for (let i2 = i1 + 1; i2 < galaxies.length; i2++) {
      sum += manhattanDistance(galaxies[i1], galaxies[i2]);
    }
  }
  return sum;
}
