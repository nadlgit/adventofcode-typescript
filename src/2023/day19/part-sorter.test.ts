import { skip } from 'node:test';
import {
  applyWorkflow,
  type ConditionOperator,
  parseInput,
  parsePartRating,
  parseWorkflow,
  type PartRatingRange,
  processPart,
  rangeApplyWorkflow,
  type RateCategory,
  splitRangeByCondition,
  type WorkflowRule,
  type WorkflowMap,
  processPossibleRanges,
} from './part-sorter.js';

describe('parseWorkflow()', () => {
  it('parses rule without condition', () => {
    expect(parseWorkflow('abc1{xy1}')).toEqual({ name: 'abc1', rules: [{ destination: 'xy1' }] });
  });

  it('parses rule with condition <', () => {
    expect(parseWorkflow('abc2{x<123:xy2}')).toEqual({
      name: 'abc2',
      rules: [{ condition: { category: 'x', operator: '<', value: 123 }, destination: 'xy2' }],
    });
  });

  it('parses rule with condition >', () => {
    expect(parseWorkflow('abc3{m>8765:xy3}')).toEqual({
      name: 'abc3',
      rules: [{ condition: { category: 'm', operator: '>', value: 8765 }, destination: 'xy3' }],
    });
  });

  it('parses workflow (multiple rules)', () => {
    expect(parseWorkflow('px{a<2006:qkq,s>2090:A,rfg}')).toEqual({
      name: 'px',
      rules: [
        { condition: { category: 'a', operator: '<', value: 2006 }, destination: 'qkq' },
        { condition: { category: 's', operator: '>', value: 2090 }, destination: 'A' },
        { destination: 'rfg' },
      ],
    });
  });
});

describe('parsePartRating()', () => {
  it('parses part', () => {
    expect(parsePartRating('{x=787,m=2655,a=1222,s=2876}')).toEqual({
      x: 787,
      m: 2655,
      a: 1222,
      s: 2876,
    });
  });
});

describe('parseInput()', () => {
  it('handles example', () => {
    expect(
      parseInput([
        'px{a<2006:qkq,m>2090:A,rfg}',
        'pv{a>1716:R,A}',
        'lnx{m>1548:A,A}',
        'rfg{s<537:gd,x>2440:R,A}',
        'qs{s>3448:A,lnx}',
        'qkq{x<1416:A,crn}',
        'crn{x>2662:A,R}',
        'in{s<1351:px,qqz}',
        'qqz{s>2770:qs,m<1801:hdj,R}',
        'gd{a>3333:R,R}',
        'hdj{m>838:A,pv}',
        '',
        '{x=787,m=2655,a=1222,s=2876}',
        '{x=1679,m=44,a=2067,s=496}',
        '{x=2036,m=264,a=79,s=2244}',
        '{x=2461,m=1339,a=466,s=291}',
        '{x=2127,m=1623,a=2188,s=1013}',
      ])
    ).toEqual({
      workflows: {
        px: [
          { condition: { category: 'a', operator: '<', value: 2006 }, destination: 'qkq' },
          { condition: { category: 'm', operator: '>', value: 2090 }, destination: 'A' },
          { destination: 'rfg' },
        ],
        pv: [
          { condition: { category: 'a', operator: '>', value: 1716 }, destination: 'R' },
          { destination: 'A' },
        ],
        lnx: [
          { condition: { category: 'm', operator: '>', value: 1548 }, destination: 'A' },
          { destination: 'A' },
        ],
        rfg: [
          { condition: { category: 's', operator: '<', value: 537 }, destination: 'gd' },
          { condition: { category: 'x', operator: '>', value: 2440 }, destination: 'R' },
          { destination: 'A' },
        ],
        qs: [
          { condition: { category: 's', operator: '>', value: 3448 }, destination: 'A' },
          { destination: 'lnx' },
        ],
        qkq: [
          { condition: { category: 'x', operator: '<', value: 1416 }, destination: 'A' },
          { destination: 'crn' },
        ],
        crn: [
          { condition: { category: 'x', operator: '>', value: 2662 }, destination: 'A' },
          { destination: 'R' },
        ],
        in: [
          { condition: { category: 's', operator: '<', value: 1351 }, destination: 'px' },
          { destination: 'qqz' },
        ],
        qqz: [
          { condition: { category: 's', operator: '>', value: 2770 }, destination: 'qs' },
          { condition: { category: 'm', operator: '<', value: 1801 }, destination: 'hdj' },
          { destination: 'R' },
        ],
        gd: [
          { condition: { category: 'a', operator: '>', value: 3333 }, destination: 'R' },
          { destination: 'R' },
        ],
        hdj: [
          { condition: { category: 'm', operator: '>', value: 838 }, destination: 'A' },
          { destination: 'pv' },
        ],
      },
      parts: [
        { x: 787, m: 2655, a: 1222, s: 2876 },
        { x: 1679, m: 44, a: 2067, s: 496 },
        { x: 2036, m: 264, a: 79, s: 2244 },
        { x: 2461, m: 1339, a: 466, s: 291 },
        { x: 2127, m: 1623, a: 2188, s: 1013 },
      ],
    });
  });
});

describe('applyWorkflow()', () => {
  describe.each<RateCategory>(['x', 'm', 'a', 's'])('given rule category %s', (category) => {
    const makePart = (categoryValue: number) => ({
      x: 1,
      m: 1,
      a: 1,
      s: 1,
      [category]: categoryValue,
    });
    const makeRules = (operator: ConditionOperator): WorkflowRule[] => [
      { condition: { category, operator, value: 10 }, destination: 'dest1' },
      { destination: 'dest2' },
    ];

    it('handles rule operator < fulfilled condition', () => {
      expect(applyWorkflow(makeRules('<'), makePart(9))).toBe('dest1');
    });

    it('handles rule operator < unfulfilled condition', () => {
      expect(applyWorkflow(makeRules('<'), makePart(10))).toBe('dest2');
    });

    it('handles rule operator > fulfilled condition', () => {
      expect(applyWorkflow(makeRules('>'), makePart(11))).toBe('dest1');
    });

    it('handles rule operator > unfulfilled condition', () => {
      expect(applyWorkflow(makeRules('>'), makePart(10))).toBe('dest2');
    });
  });

  it('respects first rule match priority', () => {
    const rules: WorkflowRule[] = [
      { condition: { category: 's', operator: '<', value: 15 }, destination: 'destS' },
      { condition: { category: 'a', operator: '<', value: 25 }, destination: 'destA' },
      { condition: { category: 'm', operator: '<', value: 35 }, destination: 'destM' },
      { condition: { category: 'x', operator: '<', value: 45 }, destination: 'destX' },
      { destination: 'dest0' },
    ];
    expect(applyWorkflow(rules, { x: 40, m: 30, a: 20, s: 99 })).toBe('destA');
  });
});

describe('processPart()', () => {
  describe('handles example', () => {
    const workflows: WorkflowMap = {
      px: [
        { condition: { category: 'a', operator: '<', value: 2006 }, destination: 'qkq' },
        { condition: { category: 'm', operator: '>', value: 2090 }, destination: 'A' },
        { destination: 'rfg' },
      ],
      pv: [
        { condition: { category: 'a', operator: '>', value: 1716 }, destination: 'R' },
        { destination: 'A' },
      ],
      lnx: [
        { condition: { category: 'm', operator: '>', value: 1548 }, destination: 'A' },
        { destination: 'A' },
      ],
      rfg: [
        { condition: { category: 's', operator: '<', value: 537 }, destination: 'gd' },
        { condition: { category: 'x', operator: '>', value: 2440 }, destination: 'R' },
        { destination: 'A' },
      ],
      qs: [
        { condition: { category: 's', operator: '>', value: 3448 }, destination: 'A' },
        { destination: 'lnx' },
      ],
      qkq: [
        { condition: { category: 'x', operator: '<', value: 1416 }, destination: 'A' },
        { destination: 'crn' },
      ],
      crn: [
        { condition: { category: 'x', operator: '>', value: 2662 }, destination: 'A' },
        { destination: 'R' },
      ],
      in: [
        { condition: { category: 's', operator: '<', value: 1351 }, destination: 'px' },
        { destination: 'qqz' },
      ],
      qqz: [
        { condition: { category: 's', operator: '>', value: 2770 }, destination: 'qs' },
        { condition: { category: 'm', operator: '<', value: 1801 }, destination: 'hdj' },
        { destination: 'R' },
      ],
      gd: [
        { condition: { category: 'a', operator: '>', value: 3333 }, destination: 'R' },
        { destination: 'R' },
      ],
      hdj: [
        { condition: { category: 'm', operator: '>', value: 838 }, destination: 'A' },
        { destination: 'pv' },
      ],
    };

    it('accepts part 1', () => {
      expect(processPart(workflows, { x: 787, m: 2655, a: 1222, s: 2876 })).toBe('A');
    });

    it('rejects part 2', () => {
      expect(processPart(workflows, { x: 1679, m: 44, a: 2067, s: 496 })).toBe('R');
    });

    it('accepts part 3', () => {
      expect(processPart(workflows, { x: 2036, m: 264, a: 79, s: 2244 })).toBe('A');
    });

    it('rejects part 4', () => {
      expect(processPart(workflows, { x: 2461, m: 1339, a: 466, s: 291 })).toBe('R');
    });

    it('accepts part 5', () => {
      expect(processPart(workflows, { x: 2127, m: 1623, a: 2188, s: 1013 })).toBe('A');
    });
  });
});

describe('splitRangeByCondition()', () => {
  const range: [number, number] = [1, 100];

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: [1, 49], invalid: [50, 100] }],
    ['<=', { valid: [1, 50], invalid: [51, 100] }],
    ['>', { valid: [51, 100], invalid: [1, 50] }],
    ['>=', { valid: [50, 100], invalid: [1, 49] }],
  ])('handles condition "%s range inner value"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 50)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: null, invalid: [1, 100] }],
    ['<=', { valid: [1, 1], invalid: [2, 100] }],
    ['>', { valid: [2, 100], invalid: [1, 1] }],
    ['>=', { valid: [1, 100], invalid: null }],
  ])('handles condition "%s range start"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 1)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: null, invalid: [1, 100] }],
    ['<=', { valid: null, invalid: [1, 100] }],
    ['>', { valid: [1, 100], invalid: null }],
    ['>=', { valid: [1, 100], invalid: null }],
  ])('handles condition "%s range start - 1"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 0)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: [1, 1], invalid: [2, 100] }],
    ['<=', { valid: [1, 2], invalid: [3, 100] }],
    ['>', { valid: [3, 100], invalid: [1, 2] }],
    ['>=', { valid: [2, 100], invalid: [1, 1] }],
  ])('handles condition "%s range start + 1"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 2)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: [1, 99], invalid: [100, 100] }],
    ['<=', { valid: [1, 100], invalid: null }],
    ['>', { valid: null, invalid: [1, 100] }],
    ['>=', { valid: [100, 100], invalid: [1, 99] }],
  ])('handles condition "%s range end"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 100)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: [1, 98], invalid: [99, 100] }],
    ['<=', { valid: [1, 99], invalid: [100, 100] }],
    ['>', { valid: [100, 100], invalid: [1, 99] }],
    ['>=', { valid: [99, 100], invalid: [1, 98] }],
  ])('handles condition "%s range end - 1"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 99)).toEqual(expected);
  });

  it.each<
    ['<' | '<=' | '>' | '>=', { valid: [number, number] | null; invalid: [number, number] | null }]
  >([
    ['<', { valid: [1, 100], invalid: null }],
    ['<=', { valid: [1, 100], invalid: null }],
    ['>', { valid: null, invalid: [1, 100] }],
    ['>=', { valid: null, invalid: [1, 100] }],
  ])('handles condition "%s range end + 1"', (comparator, expected) => {
    expect(splitRangeByCondition(range, comparator, 101)).toEqual(expected);
  });
});

describe('rangeApplyWorkflow()', () => {
  describe.each<RateCategory>(['x', 'm', 'a', 's'])('given rule category %s', (category) => {
    const range: PartRatingRange = { x: [100, 600], m: [100, 600], a: [100, 600], s: [100, 600] };
    const makeRules = (operator: ConditionOperator, value: number): WorkflowRule[] => [
      { condition: { category, operator, value }, destination: 'dest1' },
      { destination: 'dest2' },
    ];

    it('handles rule operator < totally fulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('<', 1000), range)).toEqual([
        { destination: 'dest1', range },
      ]);
    });

    it('handles rule operator < totally unfulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('<', 50), range)).toEqual([
        { destination: 'dest2', range },
      ]);
    });

    it('handles rule operator < partially fulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('<', 200), range)).toIncludeSameMembers([
        { destination: 'dest1', range: { ...range, [category]: [100, 199] } },
        { destination: 'dest2', range: { ...range, [category]: [200, 600] } },
      ]);
    });

    it('handles rule operator > totally fulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('>', 50), range)).toEqual([
        { destination: 'dest1', range },
      ]);
    });

    it('handles rule operator > totally unfulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('>', 1000), range)).toEqual([
        { destination: 'dest2', range },
      ]);
    });

    it('handles rule operator > partially fulfilled condition', () => {
      expect(rangeApplyWorkflow(makeRules('>', 200), range)).toIncludeSameMembers([
        { destination: 'dest1', range: { ...range, [category]: [201, 600] } },
        { destination: 'dest2', range: { ...range, [category]: [100, 200] } },
      ]);
    });
  });

  it('respects first rule match priority', () => {
    const rules: WorkflowRule[] = [
      { condition: { category: 's', operator: '<', value: 150 }, destination: 'destS' },
      { condition: { category: 'a', operator: '<', value: 250 }, destination: 'destA' },
      { condition: { category: 'm', operator: '<', value: 350 }, destination: 'destM' },
      { condition: { category: 'x', operator: '<', value: 450 }, destination: 'destX' },
      { destination: 'dest0' },
    ];
    expect(
      rangeApplyWorkflow(rules, { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] })
    ).toIncludeSameMembers([
      { destination: 'destS', range: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 149] } },
      { destination: 'destA', range: { x: [1, 4000], m: [1, 4000], a: [1, 249], s: [150, 4000] } },
      {
        destination: 'destM',
        range: { x: [1, 4000], m: [1, 349], a: [250, 4000], s: [150, 4000] },
      },
      {
        destination: 'destX',
        range: { x: [1, 449], m: [350, 4000], a: [250, 4000], s: [150, 4000] },
      },
      {
        destination: 'dest0',
        range: { x: [450, 4000], m: [350, 4000], a: [250, 4000], s: [150, 4000] },
      },
    ]);
  });
});

describe('processPossibleRanges()', () => {
  it('processes possible ranges', () => {
    const workflows: WorkflowMap = {
      in: [
        { condition: { category: 's', operator: '>', value: 1000 }, destination: 'px' },
        { destination: 'R' },
      ],
      px: [
        { condition: { category: 'x', operator: '>', value: 2000 }, destination: 'A' },
        { destination: 'pv' },
      ],
      pv: [
        { condition: { category: 'a', operator: '>', value: 3000 }, destination: 'R' },
        { destination: 'A' },
      ],
    };
    expect(processPossibleRanges(workflows)).toEqual({
      A: [
        { x: [2001, 4000], m: [1, 4000], a: [1, 4000], s: [1001, 4000] },
        { x: [1, 2000], m: [1, 4000], a: [1, 3000], s: [1001, 4000] },
      ],
      R: [
        { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 1000] },
        { x: [1, 2000], m: [1, 4000], a: [3001, 4000], s: [1001, 4000] },
      ],
    });
  });
});
