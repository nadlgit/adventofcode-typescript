import {
  comparePacketValuesOrder,
  findDecoderKey,
  findRightOrderedPairs,
  parsePacketPairs,
  sortPackets,
} from './signal-packets.js';

describe('parsePacketPairs()', () => {
  it('handles example', () => {
    const lines = [
      '[1,1,3,1,1]',
      '[1,1,5,1,1]',
      '',
      '[[1],[2,3,4]]',
      '[[1],4]',
      '',
      '[9]',
      '[[8,7,6]]',
      '',
      '[[4,4],4,4]',
      '[[4,4],4,4,4]',
      '',
      '[7,7,7,7]',
      '[7,7,7]',
      '',
      '[]',
      '[3]',
      '',
      '[[[]]]',
      '[[]]',
      '',
      '[1,[2,[3,[4,[5,6,7]]]],8,9]',
      '[1,[2,[3,[4,[5,6,0]]]],8,9]',
    ];
    expect(parsePacketPairs(lines)).toEqual([
      [
        [1, 1, 3, 1, 1],
        [1, 1, 5, 1, 1],
      ],
      [
        [[1], [2, 3, 4]],
        [[1], 4],
      ],
      [[9], [[8, 7, 6]]],
      [
        [[4, 4], 4, 4],
        [[4, 4], 4, 4, 4],
      ],
      [
        [7, 7, 7, 7],
        [7, 7, 7],
      ],
      [[], [3]],
      [[[[]]], [[]]],
      [
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      ],
    ]);
  });
});

describe('comparePacketValuesOrder()', () => {
  describe('compares 2 integers', () => {
    it('left < right', () => {
      const left = 1;
      const right = 2;
      expect(comparePacketValuesOrder(left, right)).toBe('pass');
    });

    it('left > right', () => {
      const left = 3;
      const right = 2;
      expect(comparePacketValuesOrder(left, right)).toBe('fail');
    });

    it('left = right', () => {
      const left = 2;
      const right = 2;
      expect(comparePacketValuesOrder(left, right)).toBe('continue');
    });
  });

  describe('compares 1-integer lists', () => {
    it('left < right', () => {
      const left = [1];
      const right = [2];
      expect(comparePacketValuesOrder(left, right)).toBe('pass');
    });

    it('left > right', () => {
      const left = [3];
      const right = [2];
      expect(comparePacketValuesOrder(left, right)).toBe('fail');
    });

    it('left = right', () => {
      const left = [2];
      const right = [2];
      expect(comparePacketValuesOrder(left, right)).toBe('continue');
    });
  });

  describe('compares 2-integer lists having same 1st value', () => {
    it('2nd left < 2nd right', () => {
      const left = [1, 1];
      const right = [1, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('pass');
    });

    it('2nd left > 2nd right', () => {
      const left = [1, 3];
      const right = [1, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('fail');
    });

    it('2nd left = 2nd right', () => {
      const left = [1, 2];
      const right = [1, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('continue');
    });
  });

  describe('compares 3-integer lists having same 1st and 2nd values', () => {
    it('3rd left < 3rd right', () => {
      const left = [1, 2, 1];
      const right = [1, 2, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('pass');
    });

    it('3rd left > 3rd right', () => {
      const left = [1, 2, 3];
      const right = [1, 2, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('fail');
    });

    it('3rd left = 3rd right', () => {
      const left = [1, 2, 2];
      const right = [1, 2, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('continue');
    });
  });

  describe('compares 1-integer list with 2-integer list having same 1st value', () => {
    it('left length < right length', () => {
      const left = [1];
      const right = [1, 2];
      expect(comparePacketValuesOrder(left, right)).toBe('pass');
    });

    it('left length > right length', () => {
      const left = [1, 2];
      const right = [1];
      expect(comparePacketValuesOrder(left, right)).toBe('fail');
    });
  });

  describe('converts integer to list given mixed values', () => {
    const integer = 1;
    const list = [1, 2];

    it('integer vs list', () => {
      expect(comparePacketValuesOrder(integer, list)).toBe(
        comparePacketValuesOrder([integer], list)
      );
    });

    it('list vs integer', () => {
      expect(comparePacketValuesOrder(list, integer)).toBe(
        comparePacketValuesOrder(list, [integer])
      );
    });
  });

  describe('handles example', () => {
    it.each([
      [[1, 1, 3, 1, 1], [1, 1, 5, 1, 1], 'pass'],
      [[[1], [2, 3, 4]], [[1], 4], 'pass'],
      [[9], [[8, 7, 6]], 'fail'],
      [[[4, 4], 4, 4], [[4, 4], 4, 4, 4], 'pass'],
      [[7, 7, 7, 7], [7, 7, 7], 'fail'],
      [[], [3], 'pass'],
      [[[[]]], [[]], 'fail'],
      [[1, [2, [3, [4, [5, 6, 7]]]], 8, 9], [1, [2, [3, [4, [5, 6, 0]]]], 8, 9], 'fail'],
    ])('%o vs %o', (left, right, expected) => {
      expect(comparePacketValuesOrder(left, right)).toBe(expected);
    });
  });
});

describe('findRightOrderedPairs()', () => {
  it('handles example', () => {
    expect(
      findRightOrderedPairs([
        [
          [1, 1, 3, 1, 1],
          [1, 1, 5, 1, 1],
        ],
        [
          [[1], [2, 3, 4]],
          [[1], 4],
        ],
        [[9], [[8, 7, 6]]],
        [
          [[4, 4], 4, 4],
          [[4, 4], 4, 4, 4],
        ],
        [
          [7, 7, 7, 7],
          [7, 7, 7],
        ],
        [[], [3]],
        [[[[]]], [[]]],
        [
          [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
          [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
        ],
      ])
    ).toIncludeSameMembers([1, 2, 4, 6]);
  });
});

describe('sortPackets()', () => {
  it('handles example', () => {
    expect(
      sortPackets([
        [1, 1, 3, 1, 1],
        [1, 1, 5, 1, 1],
        [[1], [2, 3, 4]],
        [[1], 4],
        [9],
        [[8, 7, 6]],
        [[4, 4], 4, 4],
        [[4, 4], 4, 4, 4],
        [7, 7, 7, 7],
        [7, 7, 7],
        [],
        [3],
        [[[]]],
        [[]],
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
        [[2]],
        [[6]],
      ])
    ).toEqual([
      [],
      [[]],
      [[[]]],
      [1, 1, 3, 1, 1],
      [1, 1, 5, 1, 1],
      [[1], [2, 3, 4]],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [[1], 4],
      [[2]],
      [3],
      [[4, 4], 4, 4],
      [[4, 4], 4, 4, 4],
      [[6]],
      [7, 7, 7],
      [7, 7, 7, 7],
      [[8, 7, 6]],
      [9],
    ]);
  });
});

describe('findDecoderKey()', () => {
  it('handles example', () => {
    expect(
      findDecoderKey([
        [1, 1, 3, 1, 1],
        [1, 1, 5, 1, 1],
        [[1], [2, 3, 4]],
        [[1], 4],
        [9],
        [[8, 7, 6]],
        [[4, 4], 4, 4],
        [[4, 4], 4, 4, 4],
        [7, 7, 7, 7],
        [7, 7, 7],
        [],
        [3],
        [[[]]],
        [[]],
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      ])
    ).toBe(140);
  });
});
