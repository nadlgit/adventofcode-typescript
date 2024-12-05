import {
  findOrderedUpdatesMiddlePage,
  findReorderedUpdatesMiddlePage,
  isUpdateOrdered,
  parseOrderingRules,
  parseUpdates,
  reorderUpdate,
} from './print-queue.js';

describe('parseOrderingRules()', () => {
  it('handle example', () => {
    const lines = [
      '47|53',
      '97|13',
      '97|61',
      '97|47',
      '75|29',
      '61|13',
      '75|53',
      '29|13',
      '97|29',
      '53|29',
      '61|53',
      '97|53',
      '61|29',
      '47|13',
      '75|47',
      '97|75',
      '47|61',
      '75|61',
      '47|29',
      '75|13',
      '53|13',
      '',
      '75,47,61,53,29',
      '97,61,53,29,13',
      '75,29,13',
      '75,97,47,61,53',
      '61,13,29',
      '97,13,75,29,47',
    ];
    const expected = [
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ];
    expect(parseOrderingRules(lines)).toEqual(expected);
  });
});

describe('parseUpdates()', () => {
  it('handle example', () => {
    const lines = [
      '47|53',
      '97|13',
      '97|61',
      '97|47',
      '75|29',
      '61|13',
      '75|53',
      '29|13',
      '97|29',
      '53|29',
      '61|53',
      '97|53',
      '61|29',
      '47|13',
      '75|47',
      '97|75',
      '47|61',
      '75|61',
      '47|29',
      '75|13',
      '53|13',
      '',
      '75,47,61,53,29',
      '97,61,53,29,13',
      '75,29,13',
      '75,97,47,61,53',
      '61,13,29',
      '97,13,75,29,47',
    ];
    const expected = [
      [75, 47, 61, 53, 29],
      [97, 61, 53, 29, 13],
      [75, 29, 13],
      [75, 97, 47, 61, 53],
      [61, 13, 29],
      [97, 13, 75, 29, 47],
    ];
    expect(parseUpdates(lines)).toEqual(expected);
  });
});

describe('isUpdateOrdered()', () => {
  const expectAccepted = (update: number[], rules: [number, number][]) => {
    expect(isUpdateOrdered(update, rules)).toBe(true);
  };
  const exceptRejected = (update: number[], rules: [number, number][]) => {
    expect(isUpdateOrdered(update, rules)).toBe(false);
  };

  describe('given 1 rule', () => {
    const rules: [number, number][] = [[8, 3]];

    it('reject unordered', () => {
      exceptRejected([3, 8, 1], rules);
    });

    it('accept ordered adjacent', () => {
      expectAccepted([8, 3, 1], rules);
    });

    it('accept ordered distant', () => {
      expectAccepted([8, 1, 3], rules);
    });

    it('accept update without rule first part', () => {
      expectAccepted([1, 3], rules);
    });

    it('accept update without rule second part', () => {
      expectAccepted([8, 1], rules);
    });
  });

  describe('given 2 overlapping rules', () => {
    const rules: [number, number][] = [
      [8, 3],
      [3, 5],
    ];

    it('accept both rules satisfied', () => {
      expectAccepted([8, 4, 3, 1, 5], rules);
    });

    it('reject only first rule satisfied', () => {
      exceptRejected([8, 5, 3, 1, 4], rules);
    });

    it('reject only second rule satisfied', () => {
      exceptRejected([3, 4, 8, 1, 5], rules);
    });

    it('reject both rules unsatisfied', () => {
      exceptRejected([5, 4, 3, 1, 8], rules);
    });
  });

  describe('handle example', () => {
    const rules: [number, number][] = [
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ];

    it.each([
      [[75, 47, 61, 53, 29], true],
      [[97, 61, 53, 29, 13], true],
      [[75, 29, 13], true],
      [[75, 97, 47, 61, 53], false],
      [[61, 13, 29], false],
      [[97, 13, 75, 29, 47], false],
    ])('%o -> %s', (update, expected) => {
      expected ? expectAccepted(update, rules) : exceptRejected(update, rules);
    });
  });
});

describe('reorderUpdate()', () => {
  it('handle 1 rule', () => {
    const rules: [number, number][] = [[8, 3]];
    expect(reorderUpdate([3, 8], rules)).toEqual([8, 3]);
  });

  it('handle 2 overlapping rules', () => {
    const rules: [number, number][] = [
      [8, 3],
      [3, 5],
    ];
    expect(reorderUpdate([5, 3, 8], rules)).toEqual([8, 3, 5]);
  });

  describe('handle example', () => {
    const rules: [number, number][] = [
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ];

    it.each([
      [
        [75, 97, 47, 61, 53],
        [97, 75, 47, 61, 53],
      ],
      [
        [61, 13, 29],
        [61, 29, 13],
      ],
      [
        [97, 13, 75, 29, 47],
        [97, 75, 47, 29, 13],
      ],
    ])('%o -> %o', (update, expected) => {
      expect(reorderUpdate(update, rules)).toEqual(expected);
    });
  });
});

describe('findOrderedUpdatesMiddlePage()', () => {
  it('handle example', () => {
    const rules: [number, number][] = [
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ];
    const updates = [
      [75, 47, 61, 53, 29],
      [97, 61, 53, 29, 13],
      [75, 29, 13],
      [75, 97, 47, 61, 53],
      [61, 13, 29],
      [97, 13, 75, 29, 47],
    ];
    expect(findOrderedUpdatesMiddlePage(updates, rules)).toEqual([61, 53, 29]);
  });
});

describe('findReorderedUpdatesMiddlePage()', () => {
  it('handle example', () => {
    const rules: [number, number][] = [
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ];
    const updates = [
      [75, 47, 61, 53, 29],
      [97, 61, 53, 29, 13],
      [75, 29, 13],
      [75, 97, 47, 61, 53],
      [61, 13, 29],
      [97, 13, 75, 29, 47],
    ];
    expect(findReorderedUpdatesMiddlePage(updates, rules)).toEqual([47, 29, 47]);
  });
});
