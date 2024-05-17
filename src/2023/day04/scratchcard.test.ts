import {
  calcWinningPoints,
  countFinalCards,
  identifyWinningNumbers,
  parseCard,
} from './scratchcard.js';

describe('parseCard()', () => {
  it('parses winning list', () => {
    const card = parseCard('Card 123: 41 48 83 86 17 | 83 86  6 31 17  9 48 53');
    expect(card.winningList).toEqual([41, 48, 83, 86, 17]);
  });

  it('parses player list', () => {
    const card = parseCard('Card 123: 41 48 83 86 17 | 83 86  6 31 17  9 48 53');
    expect(card.playerList).toEqual([83, 86, 6, 31, 17, 9, 48, 53]);
  });
});

describe('identifyWinningNumbers()', () => {
  it('given no match', () => {
    expect(identifyWinningNumbers([], [])).toBeEmpty();
  });

  it('given match', () => {
    expect(
      identifyWinningNumbers([41, 48, 83, 86, 17], [83, 86, 6, 31, 17, 9, 48, 53])
    ).toIncludeSameMembers([48, 83, 17, 86]);
  });
});

describe('calcWinningPoints()', () => {
  it('returns 0 given no winning number', () => {
    expect(calcWinningPoints([])).toBe(0);
  });

  it('returns 1 given 1 winning number', () => {
    expect(calcWinningPoints([1])).toBe(1);
  });

  it('returns 2 given 2 winnings numbers', () => {
    expect(calcWinningPoints([1, 2])).toBe(2);
  });

  it('returns 4 given 3 winnings numbers', () => {
    expect(calcWinningPoints([1, 2, 3])).toBe(4);
  });

  it('returns 8 given 4 winnings numbers', () => {
    expect(calcWinningPoints([1, 2, 3, 4])).toBe(8);
  });
});

describe('countFinalCards()', () => {
  it('handles example', () => {
    expect(
      countFinalCards([
        { winningList: [41, 48, 83, 86, 17], playerList: [83, 86, 6, 31, 17, 9, 48, 53] },
        { winningList: [13, 32, 20, 16, 61], playerList: [61, 30, 68, 82, 17, 32, 24, 19] },
        { winningList: [1, 21, 53, 59, 44], playerList: [69, 82, 63, 72, 16, 21, 14, 1] },
        { winningList: [41, 92, 73, 84, 69], playerList: [59, 84, 76, 51, 58, 5, 54, 83] },
        { winningList: [87, 83, 26, 28, 32], playerList: [88, 30, 70, 12, 93, 22, 82, 36] },
        { winningList: [31, 18, 13, 56, 72], playerList: [74, 77, 10, 23, 35, 67, 36, 11] },
      ])
    ).toEqual([1, 2, 4, 8, 14, 1]);
  });
});
