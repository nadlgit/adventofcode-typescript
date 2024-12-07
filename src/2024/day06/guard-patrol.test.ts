import {
  countGuardDistinctPositions,
  countPossibleObstructions,
  findGuardPath,
  LabMap,
  parseLabInput,
  type GuardPosition,
} from './guard-patrol.js';

describe('parseLabInput()', () => {
  it('parse 1 line and ignore final empty lines', () => {
    // prettier-ignore
    const lines = [
      '.#..^.....',
      '',
      '',
    ];
    expect(parseLabInput(lines)).toEqual({
      map: new LabMap(1, 10, [{ row: 0, col: 1 }]),
      guardStart: { row: 0, col: 4, direction: 'up' },
    });
  });

  it('handle example', () => {
    const lines = [
      '....#.....',
      '.........#',
      '..........',
      '..#.......',
      '.......#..',
      '..........',
      '.#..^.....',
      '........#.',
      '#.........',
      '......#...',
    ];
    expect(parseLabInput(lines)).toEqual({
      map: new LabMap(10, 10, [
        { row: 0, col: 4 },
        { row: 1, col: 9 },
        { row: 3, col: 2 },
        { row: 4, col: 7 },
        { row: 6, col: 1 },
        { row: 7, col: 8 },
        { row: 8, col: 0 },
        { row: 9, col: 6 },
      ]),
      guardStart: { row: 6, col: 4, direction: 'up' },
    });
  });
});

describe('LabMap.findGuardNextPosition()', () => {
  it.each<[GuardPosition['direction'], Omit<GuardPosition, 'direction'>]>([
    ['up', { row: 0, col: 1 }],
    ['down', { row: 2, col: 1 }],
    ['left', { row: 1, col: 0 }],
    ['right', { row: 1, col: 2 }],
  ])('go forward when no obstacle %s', (initialDirection, { row, col }) => {
    const map = new LabMap(3, 3, []);
    const guard = { row: 1, col: 1, direction: initialDirection };
    expect(map.findGuardNextPosition(guard)).toEqual({ ...guard, row, col });
  });

  it.each<[GuardPosition['direction'], GuardPosition['direction']]>([
    ['up', 'right'],
    ['right', 'down'],
    ['down', 'left'],
    ['left', 'up'],
  ])('turn right 90 degrees when in front of obstacle %s', (initialDirection, direction) => {
    const map = new LabMap(3, 3, [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ]);
    const guard = { row: 1, col: 1, direction: initialDirection };
    expect(map.findGuardNextPosition(guard)).toEqual({ ...guard, direction });
  });

  it.each<[GuardPosition['direction'], Omit<GuardPosition, 'direction'>]>([
    ['up', { row: 0, col: 1 }],
    ['down', { row: 2, col: 1 }],
    ['left', { row: 1, col: 0 }],
    ['right', { row: 1, col: 2 }],
  ])('return null when going out of map %s', (direction, { row, col }) => {
    const map = new LabMap(3, 3, []);
    expect(map.findGuardNextPosition({ row, col, direction })).toBeNull();
  });
});

describe('findGuardPath()', () => {
  it('handle path with exit', () => {
    const map = new LabMap(3, 3, []);
    const guardStart = { row: 1, col: 1, direction: 'up' as GuardPosition['direction'] };
    const path = findGuardPath(map, guardStart);
    expect(path.distinctPositions).toIncludeSameMembers([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
    ]);
    expect(path.isLoop).toBe(false);
  });

  it('handle loop path', () => {
    const map = new LabMap(4, 4, [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 3, col: 2 },
      { row: 2, col: 0 },
    ]);
    const guardStart = { row: 1, col: 1, direction: 'up' as GuardPosition['direction'] };
    const path = findGuardPath(map, guardStart);
    expect(path.distinctPositions).toIncludeSameMembers([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 2, col: 1 },
    ]);
    expect(path.isLoop).toBe(true);
  });

  describe('handle example', () => {
    const map = new LabMap(10, 10, [
      { row: 0, col: 4 },
      { row: 1, col: 9 },
      { row: 3, col: 2 },
      { row: 4, col: 7 },
      { row: 6, col: 1 },
      { row: 7, col: 8 },
      { row: 8, col: 0 },
      { row: 9, col: 6 },
    ]);
    const guardStart = { row: 6, col: 4, direction: 'up' as GuardPosition['direction'] };

    it('initial map', () => {
      const path = findGuardPath(map, guardStart);
      expect(path.distinctPositions).toHaveLength(41);
      expect(path.isLoop).toBe(false);
    });

    it('map with extra obstacle', () => {
      const path = findGuardPath(map.cloneWithExtraObstacle({ row: 6, col: 3 }), guardStart);
      expect(path.distinctPositions).toHaveLength(18);
      expect(path.isLoop).toBe(true);
    });
  });
});

describe('countGuardDistinctPositions()', () => {
  it('handle example', () => {
    const map = new LabMap(10, 10, [
      { row: 0, col: 4 },
      { row: 1, col: 9 },
      { row: 3, col: 2 },
      { row: 4, col: 7 },
      { row: 6, col: 1 },
      { row: 7, col: 8 },
      { row: 8, col: 0 },
      { row: 9, col: 6 },
    ]);
    const guardStart = { row: 6, col: 4, direction: 'up' as GuardPosition['direction'] };
    expect(countGuardDistinctPositions(map, guardStart)).toBe(41);
  });
});

describe('countPossibleObstructions()', () => {
  it('handle example', () => {
    const map = new LabMap(10, 10, [
      { row: 0, col: 4 },
      { row: 1, col: 9 },
      { row: 3, col: 2 },
      { row: 4, col: 7 },
      { row: 6, col: 1 },
      { row: 7, col: 8 },
      { row: 8, col: 0 },
      { row: 9, col: 6 },
    ]);
    const guardStart = { row: 6, col: 4, direction: 'up' as GuardPosition['direction'] };
    expect(countPossibleObstructions(map, guardStart)).toBe(6);
  });
});
