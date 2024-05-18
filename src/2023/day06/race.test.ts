import { countWinningWays, parseRaces, parseUniqueRace } from './race.js';

describe('parseRaces()', () => {
  it('handles example', () => {
    expect(parseRaces(['Time:      7  15   30', 'Distance:  9  40  200'])).toEqual([
      { time: 7, bestDistance: 9 },
      { time: 15, bestDistance: 40 },
      { time: 30, bestDistance: 200 },
    ]);
  });
});

describe('parseUniqueRace()', () => {
  it('handles example', () => {
    expect(parseUniqueRace(['Time:      7  15   30', 'Distance:  9  40  200'])).toEqual({
      time: 71530,
      bestDistance: 940200,
    });
  });
});

describe('countWinningWays()', () => {
  it.each([
    { rank: 1, race: { time: 7, bestDistance: 9 }, expected: 4 },
    { rank: 2, race: { time: 15, bestDistance: 40 }, expected: 8 },
    { rank: 3, race: { time: 30, bestDistance: 200 }, expected: 9 },
  ])('handles example race $rank', ({ race, expected }) => {
    expect(countWinningWays(race)).toBe(expected);
  });
});
