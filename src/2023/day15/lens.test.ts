import { Box, calcLensFocusingPower, decodeStep, hashString, performInitSequence } from './lens.js';

describe('hashString()', () => {
  it("returns 52 for 'HASH'", () => {
    expect(hashString('HASH')).toBe(52);
  });
});

describe('Box.putLens()', () => {
  it('adds new lens', () => {
    const box = new Box([
      { label: 'ab', focal: 2 },
      { label: 'cd', focal: 5 },
    ]);
    box.putLens('ef', 1);
    expect(box.getContent()).toEqual([
      { label: 'ab', focal: 2 },
      { label: 'cd', focal: 5 },
      { label: 'ef', focal: 1 },
    ]);
  });

  it('updates existing lens', () => {
    const box = new Box([
      { label: 'ab', focal: 2 },
      { label: 'cd', focal: 5 },
    ]);
    box.putLens('ab', 3);
    expect(box.getContent()).toEqual([
      { label: 'ab', focal: 3 },
      { label: 'cd', focal: 5 },
    ]);
  });
});

describe('Box.removeLens()', () => {
  it('removes existing lens', () => {
    const box = new Box([{ label: 'ab', focal: 2 }]);
    box.removeLens('ab');
    expect(box.getContent()).toEqual([]);
  });

  it('does nothing for not found lens', () => {
    const box = new Box([{ label: 'ab', focal: 2 }]);
    box.removeLens('cd');
    expect(box.getContent()).toEqual([{ label: 'ab', focal: 2 }]);
  });
});

describe('decodeStep()', () => {
  it.each([
    {
      str: 'rn=1',
      expected: {
        boxIdx: 0,
        lensLabel: 'rn',
        operator: '=',
        focalLength: 1,
      },
    },
    {
      str: 'cm-',
      expected: { boxIdx: 0, lensLabel: 'cm', operator: '-' },
    },
    {
      str: 'qp=3',
      expected: {
        boxIdx: 1,
        lensLabel: 'qp',
        operator: '=',
        focalLength: 3,
      },
    },
  ])('decodes $str', ({ str, expected }) => {
    expect(decodeStep(str)).toEqual(expected);
  });
});

describe('performInitSequence()', () => {
  it('handles example step 1', () => {
    expect(performInitSequence(['rn=1'])).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
    ]);
  });

  it('handles example steps 1 to 2', () => {
    expect(performInitSequence(['rn=1', 'cm-'])).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
    ]);
  });

  it('handles example steps 1 to 3', () => {
    expect(performInitSequence(['rn=1', 'cm-', 'qp=3'])).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'qp', focal: 3, boxIdx: 1, slotIdx: 0 },
    ]);
  });

  it('handles example steps 1 to 4', () => {
    expect(performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2'])).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'qp', focal: 3, boxIdx: 1, slotIdx: 0 },
    ]);
  });

  it('handles example steps 1 to 5', () => {
    expect(performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2', 'qp-'])).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
    ]);
  });

  it('handles example steps 1 to 6', () => {
    expect(
      performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2', 'qp-', 'pc=4'])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'pc', focal: 4, boxIdx: 3, slotIdx: 0 },
    ]);
  });

  it('handles example steps 1 to 7', () => {
    expect(
      performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2', 'qp-', 'pc=4', 'ot=9'])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'pc', focal: 4, boxIdx: 3, slotIdx: 0 },
      { label: 'ot', focal: 9, boxIdx: 3, slotIdx: 1 },
    ]);
  });

  it('handles example steps 1 to 8', () => {
    expect(
      performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2', 'qp-', 'pc=4', 'ot=9', 'ab=5'])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'pc', focal: 4, boxIdx: 3, slotIdx: 0 },
      { label: 'ot', focal: 9, boxIdx: 3, slotIdx: 1 },
      { label: 'ab', focal: 5, boxIdx: 3, slotIdx: 2 },
    ]);
  });

  it('handles example steps 1 to 9', () => {
    expect(
      performInitSequence(['rn=1', 'cm-', 'qp=3', 'cm=2', 'qp-', 'pc=4', 'ot=9', 'ab=5', 'pc-'])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'ot', focal: 9, boxIdx: 3, slotIdx: 0 },
      { label: 'ab', focal: 5, boxIdx: 3, slotIdx: 1 },
    ]);
  });

  it('handles example steps 1 to 10', () => {
    expect(
      performInitSequence([
        'rn=1',
        'cm-',
        'qp=3',
        'cm=2',
        'qp-',
        'pc=4',
        'ot=9',
        'ab=5',
        'pc-',
        'pc=6',
      ])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'ot', focal: 9, boxIdx: 3, slotIdx: 0 },
      { label: 'ab', focal: 5, boxIdx: 3, slotIdx: 1 },
      { label: 'pc', focal: 6, boxIdx: 3, slotIdx: 2 },
    ]);
  });

  it('handles example steps 1 to 11', () => {
    expect(
      performInitSequence([
        'rn=1',
        'cm-',
        'qp=3',
        'cm=2',
        'qp-',
        'pc=4',
        'ot=9',
        'ab=5',
        'pc-',
        'pc=6',
        'ot=7',
      ])
    ).toIncludeSameMembers([
      { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 },
      { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 },
      { label: 'ot', focal: 7, boxIdx: 3, slotIdx: 0 },
      { label: 'ab', focal: 5, boxIdx: 3, slotIdx: 1 },
      { label: 'pc', focal: 6, boxIdx: 3, slotIdx: 2 },
    ]);
  });
});

describe('calcLensFocusingPower()', () => {
  it.each([
    { lens: { label: 'rn', focal: 1, boxIdx: 0, slotIdx: 0 }, expected: 1 },
    { lens: { label: 'cm', focal: 2, boxIdx: 0, slotIdx: 1 }, expected: 4 },
    { lens: { label: 'ot', focal: 7, boxIdx: 3, slotIdx: 0 }, expected: 28 },
    { lens: { label: 'ab', focal: 5, boxIdx: 3, slotIdx: 1 }, expected: 40 },
    { lens: { label: 'pc', focal: 6, boxIdx: 3, slotIdx: 2 }, expected: 72 },
  ])('handles example lens $lens.label', ({ lens, expected }) => {
    expect(calcLensFocusingPower(lens)).toBe(expected);
  });
});
