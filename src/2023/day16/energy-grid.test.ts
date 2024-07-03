import { EnergyGrid, countEnergizedTiles, type LightBeamHead } from './energy-grid.js';

describe('EnergyGrid.findNextBeamHeads()', () => {
  describe('handles beam head on empty space', () => {
    const grid = new EnergyGrid(['...', '...', '...']);
    const beamHeadPosition = { row: 1, col: 1 };

    it.each<{ directionTo: LightBeamHead['directionTo']; expected: LightBeamHead[] }>([
      { directionTo: 'right', expected: [{ row: 1, col: 2, directionTo: 'right' }] },
      { directionTo: 'left', expected: [{ row: 1, col: 0, directionTo: 'left' }] },
      { directionTo: 'up', expected: [{ row: 0, col: 1, directionTo: 'up' }] },
      { directionTo: 'down', expected: [{ row: 2, col: 1, directionTo: 'down' }] },
    ])('going to $directionTo', ({ directionTo, expected }) => {
      expect(grid.findNextBeamHeads({ ...beamHeadPosition, directionTo })).toEqual(expected);
    });
  });

  describe('handles beam head on mirror /', () => {
    const grid = new EnergyGrid(['...', './.', '...']);
    const beamHeadPosition = { row: 1, col: 1 };

    it.each<{ directionTo: LightBeamHead['directionTo']; expected: LightBeamHead[] }>([
      { directionTo: 'right', expected: [{ row: 0, col: 1, directionTo: 'up' }] },
      { directionTo: 'left', expected: [{ row: 2, col: 1, directionTo: 'down' }] },
      { directionTo: 'up', expected: [{ row: 1, col: 2, directionTo: 'right' }] },
      { directionTo: 'down', expected: [{ row: 1, col: 0, directionTo: 'left' }] },
    ])('going to $directionTo', ({ directionTo, expected }) => {
      expect(grid.findNextBeamHeads({ ...beamHeadPosition, directionTo })).toEqual(expected);
    });
  });

  describe('handles beam head on mirror \\', () => {
    const grid = new EnergyGrid(['...', '.\\.', '...']);
    const beamHeadPosition = { row: 1, col: 1 };

    it.each<{ directionTo: LightBeamHead['directionTo']; expected: LightBeamHead[] }>([
      { directionTo: 'right', expected: [{ row: 2, col: 1, directionTo: 'down' }] },
      { directionTo: 'left', expected: [{ row: 0, col: 1, directionTo: 'up' }] },
      { directionTo: 'up', expected: [{ row: 1, col: 0, directionTo: 'left' }] },
      { directionTo: 'down', expected: [{ row: 1, col: 2, directionTo: 'right' }] },
    ])('going to $directionTo', ({ directionTo, expected }) => {
      expect(grid.findNextBeamHeads({ ...beamHeadPosition, directionTo })).toEqual(expected);
    });
  });

  describe('handles beam head on splitter |', () => {
    const grid = new EnergyGrid(['...', '.|.', '...']);
    const beamHeadPosition = { row: 1, col: 1 };

    it.each<{ directionTo: LightBeamHead['directionTo']; expected: LightBeamHead[] }>([
      {
        directionTo: 'right',
        expected: [
          { row: 0, col: 1, directionTo: 'up' },
          { row: 2, col: 1, directionTo: 'down' },
        ],
      },
      {
        directionTo: 'left',
        expected: [
          { row: 0, col: 1, directionTo: 'up' },
          { row: 2, col: 1, directionTo: 'down' },
        ],
      },
      { directionTo: 'up', expected: [{ row: 0, col: 1, directionTo: 'up' }] },
      { directionTo: 'down', expected: [{ row: 2, col: 1, directionTo: 'down' }] },
    ])('going to $directionTo', ({ directionTo, expected }) => {
      expect(grid.findNextBeamHeads({ ...beamHeadPosition, directionTo })).toIncludeSameMembers(
        expected
      );
    });
  });

  describe('handles beam head on splitter -', () => {
    const grid = new EnergyGrid(['...', '.-.', '...']);
    const beamHeadPosition = { row: 1, col: 1 };

    it.each<{ directionTo: LightBeamHead['directionTo']; expected: LightBeamHead[] }>([
      { directionTo: 'right', expected: [{ row: 1, col: 2, directionTo: 'right' }] },
      { directionTo: 'left', expected: [{ row: 1, col: 0, directionTo: 'left' }] },
      {
        directionTo: 'up',
        expected: [
          { row: 1, col: 0, directionTo: 'left' },
          { row: 1, col: 2, directionTo: 'right' },
        ],
      },
      {
        directionTo: 'down',
        expected: [
          { row: 1, col: 0, directionTo: 'left' },
          { row: 1, col: 2, directionTo: 'right' },
        ],
      },
    ])('going to $directionTo', ({ directionTo, expected }) => {
      expect(grid.findNextBeamHeads({ ...beamHeadPosition, directionTo })).toIncludeSameMembers(
        expected
      );
    });
  });
});

describe('countEnergizedTiles()', () => {
  it('handles loops', () => {
    expect(
      countEnergizedTiles(new EnergyGrid(['/.\\', '...', '\\./']), {
        row: 0,
        col: 1,
        directionTo: 'left',
      })
    ).toBe(8);
  });

  describe('handles example', () => {
    const grid = new EnergyGrid([
      '.|...\\....',
      '|.-.\\.....',
      '.....|-...',
      '........|.',
      '..........',
      '.........\\',
      '..../.\\\\..',
      '.-.-/..|..',
      '.|....-|.\\',
      '..//.|....',
    ]);

    it('entering top left corner heading to right', () => {
      expect(countEnergizedTiles(grid, { row: 0, col: 0, directionTo: 'right' })).toBe(46);
    });

    it('entering top row fourth tile', () => {
      expect(countEnergizedTiles(grid, { row: 0, col: 3, directionTo: 'down' })).toBe(51);
    });
  });
});
