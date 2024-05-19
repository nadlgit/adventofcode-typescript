import {
  type Card,
  type Hand,
  type HandType,
  identifyHandType,
  parseHand,
  sortCardsByLabel,
  sortHandList,
  sortHandsByType,
} from './hand.js';

describe('parseHand()', () => {
  it.each<{ lineNum: number; line: string; expected: Hand }>([
    { lineNum: 1, line: '32T3K 765', expected: { cards: ['3', '2', 'T', '3', 'K'], bid: 765 } },
    { lineNum: 2, line: 'T55J5 684', expected: { cards: ['T', '5', '5', 'J', '5'], bid: 684 } },
    { lineNum: 3, line: 'KK677 28', expected: { cards: ['K', 'K', '6', '7', '7'], bid: 28 } },
    { lineNum: 4, line: 'KTJJT 220', expected: { cards: ['K', 'T', 'J', 'J', 'T'], bid: 220 } },
    { lineNum: 5, line: 'QQQJA 483', expected: { cards: ['Q', 'Q', 'Q', 'J', 'A'], bid: 483 } },
  ])('handles example line $lineNum', ({ line, expected }) => {
    expect(parseHand(line)).toEqual(expected);
  });
});

describe('identifyHandType()', () => {
  describe('identifies without joker rule', () => {
    it.each<{ hand: [Card, Card, Card, Card, Card]; expected: HandType }>([
      { hand: ['A', 'A', 'A', 'A', 'A'], expected: 'Five of a kind' },
      { hand: ['A', 'A', 'A', 'A', '2'], expected: 'Four of a kind' },
      { hand: ['A', 'A', '2', 'A', 'A'], expected: 'Four of a kind' },
      { hand: ['A', 'A', 'A', '2', '2'], expected: 'Full house' },
      { hand: ['A', '2', 'A', 'A', '2'], expected: 'Full house' },
      { hand: ['A', 'A', 'A', '2', '3'], expected: 'Three of a kind' },
      { hand: ['A', '2', 'A', 'A', '3'], expected: 'Three of a kind' },
      { hand: ['A', 'A', '2', '2', '3'], expected: 'Two pair' },
      { hand: ['A', '2', '3', 'A', '2'], expected: 'Two pair' },
      { hand: ['A', 'A', '2', '3', '4'], expected: 'One pair' },
      { hand: ['2', 'A', '3', '4', 'A'], expected: 'One pair' },
      { hand: ['A', '2', '3', '4', '5'], expected: 'High card' },
    ])('$expected: $hand', ({ hand, expected }) => {
      expect(identifyHandType(hand)).toBe(expected);
    });
  });

  describe('identifies with joker rule', () => {
    it.each<{ hand: [Card, Card, Card, Card, Card]; expected: HandType }>([
      { hand: ['J', 'J', 'J', 'J', 'J'], expected: 'Five of a kind' },
      { hand: ['J', 'J', 'A', 'A', 'A'], expected: 'Five of a kind' },
      { hand: ['J', 'J', 'A', 'A', '2'], expected: 'Four of a kind' },
      { hand: ['J', 'A', 'A', '2', '2'], expected: 'Full house' },
      { hand: ['J', 'A', 'A', '2', '3'], expected: 'Three of a kind' },
      { hand: ['J', '2', '3', '4', '5'], expected: 'One pair' },
    ])('$expected: $hand', ({ hand, expected }) => {
      expect(identifyHandType(hand, true)).toBe(expected);
    });
  });
});

describe('sortHandsByType()', () => {
  it('compares by hand type order', () => {
    const allTypesDescending: HandType[] = [
      'Five of a kind',
      'Four of a kind',
      'Full house',
      'Three of a kind',
      'Two pair',
      'One pair',
      'High card',
    ];
    for (let idx1 = 0; idx1 < allTypesDescending.length; idx1++) {
      for (let idx2 = 0; idx2 < allTypesDescending.length; idx2++) {
        const hand1 = allTypesDescending[idx1];
        const hand2 = allTypesDescending[idx2];
        const expected = Math.sign(idx2 - idx1);
        const testCase = `'${hand1}' vs '${hand2}': `;
        expect(testCase + sortHandsByType(hand1, hand2)).toBe(testCase + expected);
      }
    }
  });
});

describe('sortCardsByLabel()', () => {
  it('compares by label order without joker rule', () => {
    const allCardsDescending: Card[] = [
      'A',
      'K',
      'Q',
      'J',
      'T',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
    ];
    for (let idx1 = 0; idx1 < allCardsDescending.length; idx1++) {
      for (let idx2 = 0; idx2 < allCardsDescending.length; idx2++) {
        const card1 = allCardsDescending[idx1];
        const card2 = allCardsDescending[idx2];
        const expected = Math.sign(idx2 - idx1);
        const testCase = `${card1} vs ${card2}: `;
        expect(testCase + sortCardsByLabel(card1, card2)).toBe(testCase + expected);
      }
    }
  });

  it('compares by label order with joker rule', () => {
    const allCardsDescending: Card[] = [
      'A',
      'K',
      'Q',
      'T',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
      'J',
    ];
    for (let idx1 = 0; idx1 < allCardsDescending.length; idx1++) {
      for (let idx2 = 0; idx2 < allCardsDescending.length; idx2++) {
        const card1 = allCardsDescending[idx1];
        const card2 = allCardsDescending[idx2];
        const expected = Math.sign(idx2 - idx1);
        const testCase = `${card1} vs ${card2}: `;
        expect(testCase + sortCardsByLabel(card1, card2, true)).toBe(testCase + expected);
      }
    }
  });
});

describe('sortHandList()', () => {
  it('handles example without joker rule', () => {
    expect(
      sortHandList([
        { cards: ['3', '2', 'T', '3', 'K'], bid: 765 },
        { cards: ['T', '5', '5', 'J', '5'], bid: 684 },
        { cards: ['K', 'K', '6', '7', '7'], bid: 28 },
        { cards: ['K', 'T', 'J', 'J', 'T'], bid: 220 },
        { cards: ['Q', 'Q', 'Q', 'J', 'A'], bid: 483 },
      ])
    ).toEqual([
      { rank: 1, cards: ['3', '2', 'T', '3', 'K'], bid: 765 },
      { rank: 2, cards: ['K', 'T', 'J', 'J', 'T'], bid: 220 },
      { rank: 3, cards: ['K', 'K', '6', '7', '7'], bid: 28 },
      { rank: 4, cards: ['T', '5', '5', 'J', '5'], bid: 684 },
      { rank: 5, cards: ['Q', 'Q', 'Q', 'J', 'A'], bid: 483 },
    ]);
  });

  it('handles example with joker rule', () => {
    expect(
      sortHandList(
        [
          { cards: ['3', '2', 'T', '3', 'K'], bid: 765 },
          { cards: ['T', '5', '5', 'J', '5'], bid: 684 },
          { cards: ['K', 'K', '6', '7', '7'], bid: 28 },
          { cards: ['K', 'T', 'J', 'J', 'T'], bid: 220 },
          { cards: ['Q', 'Q', 'Q', 'J', 'A'], bid: 483 },
        ],
        true
      )
    ).toEqual([
      { rank: 1, cards: ['3', '2', 'T', '3', 'K'], bid: 765 },
      { rank: 2, cards: ['K', 'K', '6', '7', '7'], bid: 28 },
      { rank: 3, cards: ['T', '5', '5', 'J', '5'], bid: 684 },
      { rank: 4, cards: ['Q', 'Q', 'Q', 'J', 'A'], bid: 483 },
      { rank: 5, cards: ['K', 'T', 'J', 'J', 'T'], bid: 220 },
    ]);
  });
});
