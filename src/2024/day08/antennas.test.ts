import { AntennaMap } from './antennas.js';

describe('AntennaMap.parse()', () => {
  it('parse 1 line and ignore final empty lines', () => {
    const lines = ['.0..9.az...A.Z.', '', ''];
    expect(AntennaMap.parse(lines)).toEqual(
      new AntennaMap(1, 15, [
        { frequency: '0', row: 0, col: 1 },
        { frequency: '9', row: 0, col: 4 },
        { frequency: 'a', row: 0, col: 6 },
        { frequency: 'z', row: 0, col: 7 },
        { frequency: 'A', row: 0, col: 11 },
        { frequency: 'Z', row: 0, col: 13 },
      ])
    );
  });

  it('handle main example', () => {
    const lines = [
      '............',
      '........0...',
      '.....0......',
      '.......0....',
      '....0.......',
      '......A.....',
      '............',
      '............',
      '........A...',
      '.........A..',
      '............',
      '............',
    ];
    expect(AntennaMap.parse(lines)).toEqual(
      new AntennaMap(12, 12, [
        { frequency: '0', row: 1, col: 8 },
        { frequency: '0', row: 2, col: 5 },
        { frequency: '0', row: 3, col: 7 },
        { frequency: '0', row: 4, col: 4 },
        { frequency: 'A', row: 5, col: 6 },
        { frequency: 'A', row: 8, col: 8 },
        { frequency: 'A', row: 9, col: 9 },
      ])
    );
  });
});

describe('AntennaMap.findAntinodeLocations() with distance parameter', () => {
  const getMapAntinodeLocations = (map: AntennaMap) => map.findAntinodeLocations(false);

  it('find 2 antinodes for 2 antennas of same frequency', () => {
    const map = new AntennaMap(10, 10, [
      { frequency: 'a', row: 3, col: 4 },
      { frequency: 'a', row: 5, col: 5 },
    ]);
    expect(getMapAntinodeLocations(map)).toIncludeSameMembers([
      { row: 1, col: 3 },
      { row: 7, col: 6 },
    ]);
  });

  it('ignore antinodes out of bounds', () => {
    const map = new AntennaMap(10, 10, [
      { frequency: 'a', row: 3, col: 4 },
      { frequency: 'a', row: 4, col: 8 },
      { frequency: 'a', row: 5, col: 5 },
    ]);
    expect(getMapAntinodeLocations(map)).toIncludeSameMembers([
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 6, col: 2 },
      { row: 7, col: 6 },
    ]);
  });

  it('handle main example', () => {
    const map = new AntennaMap(12, 12, [
      { frequency: '0', row: 1, col: 8 },
      { frequency: '0', row: 2, col: 5 },
      { frequency: '0', row: 3, col: 7 },
      { frequency: '0', row: 4, col: 4 },
      { frequency: 'A', row: 5, col: 6 },
      { frequency: 'A', row: 8, col: 8 },
      { frequency: 'A', row: 9, col: 9 },
    ]);
    expect(getMapAntinodeLocations(map)).toIncludeSameMembers([
      { row: 0, col: 6 },
      { row: 0, col: 11 },
      { row: 1, col: 3 },
      { row: 2, col: 4 },
      { row: 2, col: 10 },
      { row: 3, col: 2 },
      { row: 4, col: 9 },
      { row: 5, col: 1 },
      { row: 5, col: 6 },
      { row: 6, col: 3 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
      { row: 10, col: 10 },
      { row: 11, col: 10 },
    ]);
  });
});

describe('AntennaMap.findAntinodeLocations() ignoring distance', () => {
  const getMapAntinodeLocations = (map: AntennaMap) => map.findAntinodeLocations(true);

  it('find all grid positions aligned with 2 antennas of same frequency', () => {
    const map = new AntennaMap(10, 10, [
      { frequency: 'T', row: 0, col: 0 },
      { frequency: 'T', row: 1, col: 3 },
      { frequency: 'T', row: 2, col: 1 },
    ]);
    expect(getMapAntinodeLocations(map)).toIncludeSameMembers([
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 1, col: 3 },
      { row: 2, col: 1 },
      { row: 2, col: 6 },
      { row: 3, col: 9 },
      { row: 4, col: 2 },
      { row: 6, col: 3 },
      { row: 8, col: 4 },
    ]);
  });

  it('handle main example', () => {
    const map = new AntennaMap(12, 12, [
      { frequency: '0', row: 1, col: 8 },
      { frequency: '0', row: 2, col: 5 },
      { frequency: '0', row: 3, col: 7 },
      { frequency: '0', row: 4, col: 4 },
      { frequency: 'A', row: 5, col: 6 },
      { frequency: 'A', row: 8, col: 8 },
      { frequency: 'A', row: 9, col: 9 },
    ]);
    expect(getMapAntinodeLocations(map)).toHaveLength(34);
  });
});
