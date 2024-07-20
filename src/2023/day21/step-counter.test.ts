import {
  countReachablePlots,
  findReachablePlots,
  Garden,
  specificCountReachablePlots,
} from './step-counter.js';

describe('Garden', () => {
  describe('constructor', () => {
    it('initializes start position', () => {
      const garden = new Garden(['.....', '..S..', '.....']);
      expect(garden.startPosition).toEqual({ row: 1, col: 2 });
    });
  });

  describe('getSingleStepReachablePlots()', () => {
    it('selects adjacent plots', () => {
      const garden = new Garden(['.....', '.....', '.....']);
      expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 0, col: 2 },
        { row: 2, col: 2 },
      ]);
    });

    it('selects starting position as plot', () => {
      const garden = new Garden(['..S..', '.....', '.....']);
      expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 0, col: 2 },
        { row: 2, col: 2 },
      ]);
    });

    describe('ignores adjacent rock', () => {
      it('on top', () => {
        const garden = new Garden(['..#..', '.....', '.....']);
        expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
          { row: 1, col: 1 },
          { row: 1, col: 3 },
          { row: 2, col: 2 },
        ]);
      });

      it('on bottom', () => {
        const garden = new Garden(['.....', '.....', '..#..']);
        expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
          { row: 1, col: 1 },
          { row: 1, col: 3 },
          { row: 0, col: 2 },
        ]);
      });

      it('on left', () => {
        const garden = new Garden(['.....', '.#...', '.....']);
        expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
          { row: 1, col: 3 },
          { row: 0, col: 2 },
          { row: 2, col: 2 },
        ]);
      });

      it('on right', () => {
        const garden = new Garden(['.....', '...#.', '.....']);
        expect(garden.getSingleStepReachablePlots({ row: 1, col: 2 })).toIncludeSameMembers([
          { row: 1, col: 1 },
          { row: 0, col: 2 },
          { row: 2, col: 2 },
        ]);
      });
    });

    describe('handles infinite map', () => {
      let garden: Garden;
      beforeEach(() => {
        garden = new Garden(['.....', '...#.', '.....']);
      });

      it.each([1, 2, 1234567])('repeated on right %i time(s)', (n) => {
        const row = 1 + 3 * n;
        expect(garden.getSingleStepReachablePlots({ row, col: 2 })).toIncludeSameMembers([
          { row, col: 1 },
          { row: row - 1, col: 2 },
          { row: row + 1, col: 2 },
        ]);
      });

      it.each([1, 2, 1234567])('repeated on left %i time(s)', (n) => {
        const row = 1 - 3 * n;
        expect(garden.getSingleStepReachablePlots({ row, col: 2 })).toIncludeSameMembers([
          { row, col: 1 },
          { row: row - 1, col: 2 },
          { row: row + 1, col: 2 },
        ]);
      });

      it.each([1, 2, 1234567])('repeated on bottom %i time(s)', (n) => {
        const col = 2 + 5 * n;
        expect(garden.getSingleStepReachablePlots({ row: 1, col })).toIncludeSameMembers([
          { row: 1, col: col - 1 },
          { row: 0, col },
          { row: 2, col },
        ]);
      });

      it.each([1, 2, 1234567])('repeated on top %i time(s)', (n) => {
        const col = 2 - 5 * n;
        expect(garden.getSingleStepReachablePlots({ row: 1, col })).toIncludeSameMembers([
          { row: 1, col: col - 1 },
          { row: 0, col },
          { row: 2, col },
        ]);
      });
    });
  });
});

describe('findReachablePlots()', () => {
  describe('given 5x5 map', () => {
    it.each([
      [
        1,
        [
          { row: 1, col: 2 },
          { row: 2, col: 3 },
          { row: 3, col: 2 },
        ],
      ],
      [
        2,
        [
          { row: 0, col: 2 },
          { row: 1, col: 3 },
          { row: 2, col: 2 },
          { row: 2, col: 4 },
          { row: 3, col: 1 },
          { row: 4, col: 2 },
        ],
      ],
      [
        3,
        [
          { row: -1, col: 2 },
          { row: 0, col: 1 },
          { row: 0, col: 3 },
          { row: 1, col: 2 },
          { row: 1, col: 4 },
          { row: 2, col: 3 },
          { row: 2, col: 5 },
          { row: 3, col: 0 },
          { row: 3, col: 2 },
          { row: 3, col: 4 },
          { row: 4, col: 1 },
          { row: 4, col: 3 },
          { row: 5, col: 2 },
        ],
      ],
      [
        4,
        [
          { row: -2, col: 2 },
          { row: -1, col: 1 },
          { row: -1, col: 3 },
          { row: 0, col: 0 },
          { row: 0, col: 2 },
          { row: 0, col: 4 },
          { row: 1, col: 3 },
          { row: 1, col: 5 },
          { row: 2, col: 0 },
          { row: 2, col: 2 },
          { row: 2, col: 4 },
          { row: 3, col: -1 },
          { row: 3, col: 1 },
          { row: 3, col: 5 },
          { row: 4, col: 0 },
          { row: 4, col: 2 },
          { row: 4, col: 4 },
          { row: 5, col: 1 },
          { row: 5, col: 3 },
          { row: 6, col: 2 },
        ],
      ],
      [
        5,
        [
          { row: -3, col: 2 },
          { row: -2, col: 1 },
          { row: -1, col: 0 },
          { row: -1, col: 2 },
          { row: -1, col: 4 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
          { row: 0, col: 3 },
          { row: 0, col: 5 },
          { row: 1, col: 0 },
          { row: 1, col: 2 },
          { row: 1, col: 4 },
          { row: 2, col: -1 },
          { row: 2, col: 3 },
          { row: 2, col: 5 },
          { row: 3, col: 0 },
          { row: 3, col: 2 },
          { row: 3, col: 4 },
          { row: 3, col: 6 },
          { row: 4, col: -1 },
          { row: 4, col: 1 },
          { row: 4, col: 3 },
          { row: 4, col: 5 },
          { row: 5, col: 0 },
          { row: 5, col: 2 },
          { row: 5, col: 4 },
          { row: 6, col: 3 },
          { row: 7, col: 2 },
        ],
      ],
    ])('handles %i step(s)', (steps, expected) => {
      //prettier-ignore
      const garden = new Garden([
        '.....',
        '.#...',
        '.#S..',
        '...#.',
        '.....'
      ]);
      expect(findReachablePlots(garden, steps)).toIncludeSameMembers(expected);
    });
  });

  it('handles example given 6 steps', () => {
    const garden = new Garden([
      '...........',
      '.....###.#.',
      '.###.##..#.',
      '..#.#...#..',
      '....#.#....',
      '.##..S####.',
      '.##..#...#.',
      '.......##..',
      '.##.#.####.',
      '.##..##.##.',
      '...........',
    ]);
    expect(findReachablePlots(garden, 6)).toIncludeSameMembers([
      { row: 2, col: 8 },
      { row: 3, col: 1 },
      { row: 3, col: 3 },
      { row: 3, col: 5 },
      { row: 3, col: 7 },
      { row: 4, col: 0 },
      { row: 4, col: 2 },
      { row: 4, col: 8 },
      { row: 5, col: 3 },
      { row: 5, col: 5 },
      { row: 6, col: 4 },
      { row: 6, col: 6 },
      { row: 7, col: 1 },
      { row: 7, col: 3 },
      { row: 7, col: 5 },
      { row: 9, col: 3 },
    ]);
  });
});

describe('countReachablePlot()', () => {
  it.each([
    [6, 16],
    [10, 50],
    [50, 1594],
    [100, 6536],
    [500, 167004],
    // execution is a bit long: [1000, 668697],
    // execution is too long: [5000, 16733044],
  ])('handles example given %i steps', (steps, expected) => {
    const garden = new Garden([
      '...........',
      '.....###.#.',
      '.###.##..#.',
      '..#.#...#..',
      '....#.#....',
      '.##..S####.',
      '.##..#...#.',
      '.......##..',
      '.##.#.####.',
      '.##..##.##.',
      '...........',
    ]);
    expect(countReachablePlots(garden, steps)).toBe(expected);
  });
});

describe('specificCountReachablePlots()', () => {
  it.each([
    [7, 52],
    [8, 68],
    [25, 576],
    [42, 1576],
    [59, 3068],
    [76, 5052],
    [1180148, 1185525742508],
  ])('handles Reddit example given %i steps', (steps, expected) => {
    // https://www.reddit.com/r/adventofcode/comments/18o1071/2023_day_21_a_better_example_input_mild_part_2/
    const garden = new Garden([
      '.................',
      '..#..............',
      '...##........###.',
      '.............##..',
      '..#....#.#.......',
      '.......#.........',
      '......##.##......',
      '...##.#.....#....',
      '........S........',
      '....#....###.#...',
      '......#..#.#.....',
      '.....#.#..#......',
      '.#...............',
      '.#.....#.#....#..',
      '...#.........#.#.',
      '...........#..#..',
      '.................',
    ]);
    expect(specificCountReachablePlots(garden, steps)).toBe(expected);
  });
});
