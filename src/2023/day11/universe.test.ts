import {
  calcExpandedUniverseGalaxies,
  parseUniverse,
  sumGalaxiesShortestPaths,
} from './universe.js';

describe('parseUniverse()', () => {
  const image = [
    '...#.......',
    '.......#...',
    '#..........',
    '...........',
    '......#....',
    '.#.........',
    '.........#.',
    '...........',
    '.......#...',
    '#...#......',
  ];

  it('counts universe size', () => {
    const universe = parseUniverse(image);
    expect(universe.nbRows).toBe(10);
    expect(universe.nbCols).toBe(11);
  });

  it('parses galaxies', () => {
    const universe = parseUniverse(image);
    expect(universe.galaxies).toIncludeSameMembers([
      [0, 3],
      [1, 7],
      [2, 0],
      [4, 6],
      [5, 1],
      [6, 9],
      [8, 7],
      [9, 0],
      [9, 4],
    ]);
  });

  it('detects and sorts empty rows', () => {
    const universe = parseUniverse(image);
    expect(universe.emptyRowsIndices).toEqual([3, 7]);
  });

  it('detects and sorts empty columns', () => {
    const universe = parseUniverse(image);
    expect(universe.emptyColsIndices).toEqual([2, 5, 8, 10]);
  });
});

describe('calcExpandedUniverseGalaxies()', () => {
  const image = [
    '...#.......',
    '.......#...',
    '#..........',
    '...........',
    '......#....',
    '.#.........',
    '.........#.',
    '...........',
    '.......#...',
    '#...#......',
  ];

  it('expands empty space twice', () => {
    const universe = parseUniverse(image);
    expect(calcExpandedUniverseGalaxies(universe, 2)).toIncludeSameMembers([
      [0, 4],
      [1, 9],
      [2, 0],
      [5, 8],
      [6, 1],
      [7, 12],
      [10, 9],
      [11, 0],
      [11, 5],
    ]);
  });

  it('expands empty space 3 times', () => {
    const universe = parseUniverse(image);
    expect(calcExpandedUniverseGalaxies(universe, 3)).toIncludeSameMembers([
      [0, 5],
      [1, 11],
      [2, 0],
      [6, 10],
      [7, 1],
      [8, 15],
      [12, 11],
      [13, 0],
      [13, 6],
    ]);
  });
});

describe('sumGalaxiesShortestPaths()', () => {
  const image = [
    '...#.......',
    '.......#...',
    '#..........',
    '...........',
    '......#....',
    '.#.........',
    '.........#.',
    '...........',
    '.......#...',
    '#...#......',
  ];

  it('handles default twice expansion', () => {
    const universe = parseUniverse(image);
    expect(sumGalaxiesShortestPaths(universe)).toBe(374);
  });

  it('handles 10 times expansion', () => {
    const universe = parseUniverse(image);
    expect(sumGalaxiesShortestPaths(universe, 10)).toBe(1030);
  });

  it('handles 100 times expansion', () => {
    const universe = parseUniverse(image);
    expect(sumGalaxiesShortestPaths(universe, 100)).toBe(8410);
  });
});
