import {
  type CubeSet,
  type Game,
  identifyGameMinCubeSet,
  isPossibleGame,
  parseGame,
} from './game.js';

describe('parseGame()', () => {
  it('parses id', () => {
    const game = parseGame('Game 12345: 12 red, 34 green, 56 blue');
    expect(game.id).toBe(12345);
  });

  it('parses set with all colors', () => {
    const game = parseGame('Game 12345: 12 red, 34 green, 56 blue');
    expect(game.sets).toIncludeSameMembers([{ red: 12, green: 34, blue: 56 }]);
  });

  it('parses set with missing color', () => {
    const game = parseGame('Game 12345: 12 red, 56 blue');
    expect(game.sets).toIncludeSameMembers([{ red: 12, blue: 56 }]);
  });

  it('parses multiple sets', () => {
    const game = parseGame('Game 12345: 12 red, 34 green, 56 blue;  9 red, 8 green, 7 blue');
    expect(game.sets).toIncludeSameMembers([
      { red: 12, green: 34, blue: 56 },
      { red: 9, green: 8, blue: 7 },
    ]);
  });

  it.each<{ line: string; expected: Game }>([
    {
      line: 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
      expected: { id: 1, sets: [{ blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 }] },
    },
    {
      line: 'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
      expected: {
        id: 2,
        sets: [
          { blue: 1, green: 2 },
          { green: 3, blue: 4, red: 1 },
          { green: 1, blue: 1 },
        ],
      },
    },
    {
      line: 'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
      expected: {
        id: 3,
        sets: [
          { green: 8, blue: 6, red: 20 },
          { blue: 5, red: 4, green: 13 },
          { green: 5, red: 1 },
        ],
      },
    },
    {
      line: 'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
      expected: {
        id: 4,
        sets: [
          { green: 1, red: 3, blue: 6 },
          { green: 3, red: 6 },
          { green: 3, blue: 15, red: 14 },
        ],
      },
    },
    {
      line: 'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green',
      expected: {
        id: 5,
        sets: [
          { red: 6, blue: 1, green: 3 },
          { blue: 2, red: 1, green: 2 },
        ],
      },
    },
  ])('parses example game $expected.id', ({ line, expected }) => {
    const game = parseGame(line);
    expect(game.id).toBe(expected.id);
    expect(game.sets).toIncludeSameMembers(expected.sets);
  });
});

describe('isPossibleGame()', () => {
  it.each<{ game: Game; expected: boolean }>([
    {
      game: { id: 1, sets: [{ blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 }] },
      expected: true,
    },
    {
      game: {
        id: 2,
        sets: [
          { blue: 1, green: 2 },
          { green: 3, blue: 4, red: 1 },
          { green: 1, blue: 1 },
        ],
      },
      expected: true,
    },
    {
      game: {
        id: 3,
        sets: [
          { green: 8, blue: 6, red: 20 },
          { blue: 5, red: 4, green: 13 },
          { green: 5, red: 1 },
        ],
      },
      expected: false,
    },
    {
      game: {
        id: 4,
        sets: [
          { green: 1, red: 3, blue: 6 },
          { green: 3, red: 6 },
          { green: 3, blue: 15, red: 14 },
        ],
      },
      expected: false,
    },
    {
      game: {
        id: 5,
        sets: [
          { red: 6, blue: 1, green: 3 },
          { blue: 2, red: 1, green: 2 },
        ],
      },
      expected: true,
    },
  ])('is $expected for game $game.id', ({ game, expected }) => {
    const bag: CubeSet = { red: 12, green: 13, blue: 14 };
    expect(isPossibleGame(game, bag)).toBe(expected);
  });
});

describe('findGameMinCubeSet()', () => {
  it.each<{ game: Game; expected: Required<CubeSet> }>([
    {
      game: { id: 1, sets: [{ blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 }] },
      expected: { red: 4, green: 2, blue: 6 },
    },
    {
      game: {
        id: 2,
        sets: [
          { blue: 1, green: 2 },
          { green: 3, blue: 4, red: 1 },
          { green: 1, blue: 1 },
        ],
      },
      expected: { red: 1, green: 3, blue: 4 },
    },
    {
      game: {
        id: 3,
        sets: [
          { green: 8, blue: 6, red: 20 },
          { blue: 5, red: 4, green: 13 },
          { green: 5, red: 1 },
        ],
      },
      expected: { red: 20, green: 13, blue: 6 },
    },
    {
      game: {
        id: 4,
        sets: [
          { green: 1, red: 3, blue: 6 },
          { green: 3, red: 6 },
          { green: 3, blue: 15, red: 14 },
        ],
      },
      expected: { red: 14, green: 3, blue: 15 },
    },
    {
      game: {
        id: 5,
        sets: [
          { red: 6, blue: 1, green: 3 },
          { blue: 2, red: 1, green: 2 },
        ],
      },
      expected: { red: 6, green: 3, blue: 2 },
    },
  ])('is $expected for game $game.id', ({ game, expected }) => {
    const bag: CubeSet = { red: 12, green: 13, blue: 14 };
    expect(identifyGameMinCubeSet(game)).toEqual(expected);
  });
});
