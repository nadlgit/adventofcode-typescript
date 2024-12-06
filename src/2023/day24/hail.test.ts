import {
  countXYAreaIntersections,
  findHailstoneXYIntersection,
  parseHail,
  solveXYLinearEquationSystem,
} from './hail.js';

describe('parseHail()', () => {
  const expectHailParsing = (lines: string[], hailstones: ReturnType<typeof parseHail>) => {
    expect(parseHail(lines)).toEqual(hailstones);
  };

  it('parse 1 line', () => {
    expectHailParsing(
      ['19, 13, 30 @ -2, 1, -2'],
      [{ position: { x: 19, y: 13, z: 30 }, velocity: { x: -2, y: 1, z: -2 } }]
    );
  });

  it('ignore empty line', () => {
    expectHailParsing([''], []);
  });

  it('handle example', () => {
    expectHailParsing(
      [
        '19, 13, 30 @ -2, 1, -2',
        '18, 19, 22 @ -1, -1, -2',
        '20, 25, 34 @ -2, -2, -4',
        '12, 31, 28 @ -1, -2, -1',
        '20, 19, 15 @ 1, -5, -3',
      ],
      [
        { position: { x: 19, y: 13, z: 30 }, velocity: { x: -2, y: 1, z: -2 } },
        { position: { x: 18, y: 19, z: 22 }, velocity: { x: -1, y: -1, z: -2 } },
        { position: { x: 20, y: 25, z: 34 }, velocity: { x: -2, y: -2, z: -4 } },
        { position: { x: 12, y: 31, z: 28 }, velocity: { x: -1, y: -2, z: -1 } },
        { position: { x: 20, y: 19, z: 15 }, velocity: { x: 1, y: -5, z: -3 } },
      ]
    );
  });
});

describe('solveXYLinearEquationSystem()', () => {
  it('handle coincident lines', () => {
    expect(
      solveXYLinearEquationSystem({
        a1: 2,
        b1: 1,
        c1: 0,
        a2: 2,
        b2: 1,
        c2: 0,
      })
    ).toBe('infinity');
  });

  it('handle parallel lines', () => {
    expect(
      solveXYLinearEquationSystem({
        a1: 2,
        b1: 1,
        c1: 0,
        a2: 2,
        b2: 1,
        c2: 3,
      })
    ).toBe('none');
  });

  it('handle intersection', () => {
    expect(
      solveXYLinearEquationSystem({
        a1: 1,
        b1: 0,
        c1: -1,
        a2: 0,
        b2: 1,
        c2: -2,
      })
    ).toEqual({ x: 1, y: 2 });
  });
});

describe('findHailstoneXYIntersection()', () => {
  describe('handle basic horizontal and vertical paths', () => {
    const hail = [
      { position: { x: 1, y: 0, z: 0 }, velocity: { x: 0, y: 1, z: 0 } },
      { position: { x: 2, y: 0, z: 0 }, velocity: { x: 0, y: 1, z: 0 } },
      { position: { x: 2, y: 1, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
      { position: { x: -2, y: 2, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
      { position: { x: -2, y: 1, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
    ];

    it.each([
      // Test pairs
      [1, 2, { type: 'none' }],
      [1, 3, { type: 'past', x: 1, y: 1 }],
      [1, 4, { type: 'future', x: 1, y: 2 }],
      [2, 5, { type: 'future', x: 2, y: 1 }],
      [2, 4, { type: 'future', x: 2, y: 2 }],
      // Other pairs
      [1, 5, { type: 'future', x: 1, y: 1 }],
      [2, 3, { type: 'past', x: 2, y: 1 }],
      [3, 4, { type: 'none' }],
      [3, 5, { type: 'none' }],
      [4, 5, { type: 'none' }],
    ])('pair %i vs %i', (rank1, rank2, expected) => {
      const intersection = findHailstoneXYIntersection(hail[rank1 - 1], hail[rank2 - 1]);
      expect(intersection).toEqual(expected);
    });
  });

  describe('handle example', () => {
    const hail = [
      { position: { x: 19, y: 13, z: 30 }, velocity: { x: -2, y: 1, z: -2 } },
      { position: { x: 18, y: 19, z: 22 }, velocity: { x: -1, y: -1, z: -2 } },
      { position: { x: 20, y: 25, z: 34 }, velocity: { x: -2, y: -2, z: -4 } },
      { position: { x: 12, y: 31, z: 28 }, velocity: { x: -1, y: -2, z: -1 } },
      { position: { x: 20, y: 19, z: 15 }, velocity: { x: 1, y: -5, z: -3 } },
    ];

    it.each([
      [
        1,
        2,
        {
          type: 'future',
          x: expect.closeTo(14.333, 3) as number,
          y: expect.closeTo(15.333, 3) as number,
        },
      ],
      [
        1,
        3,
        {
          type: 'future',
          x: expect.closeTo(11.667, 3) as number,
          y: expect.closeTo(16.667, 3) as number,
        },
      ],
      [1, 4, { type: 'future', x: 6.2, y: 19.4 }],
      [
        1,
        5,
        {
          type: 'past',
          x: expect.closeTo(21.444, 3) as number,
          y: expect.closeTo(11.778, 3) as number,
        },
      ],
      [2, 3, { type: 'none' }],
      [2, 4, { type: 'future', x: -6, y: -5 }],
      [
        2,
        5,
        {
          type: 'past',
          x: expect.closeTo(19.667, 3) as number,
          y: expect.closeTo(20.667, 3) as number,
        },
      ],
      [3, 4, { type: 'future', x: -2, y: 3 }],
      [3, 5, { type: 'past', x: 19, y: 24 }],
      [4, 5, { type: 'past', x: 16, y: 39 }],
    ])('pair %i vs %i', (rank1, rank2, expected) => {
      const intersection = findHailstoneXYIntersection(hail[rank1 - 1], hail[rank2 - 1]);
      expect(intersection).toEqual(expected);
    });
  });
});

describe('countXYAreaIntersections()', () => {
  const testHail = [
    { position: { x: 1, y: 0, z: 0 }, velocity: { x: 0, y: 1, z: 0 } },
    { position: { x: 2, y: 0, z: 0 }, velocity: { x: 0, y: 1, z: 0 } },
    { position: { x: 2, y: 1, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
    { position: { x: -2, y: 2, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
    { position: { x: -2, y: 1, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
  ];

  it('count only future intersections', () => {
    expect(
      countXYAreaIntersections(testHail, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    ).toBe(4);
  });

  it('ignore intersections satisfying only min x or min y', () => {
    expect(countXYAreaIntersections(testHail, 2, Number.MAX_SAFE_INTEGER)).toBe(1);
  });

  it('ignore intersections satisfying only max x or max y', () => {
    expect(countXYAreaIntersections(testHail, Number.MIN_SAFE_INTEGER, 1)).toBe(1);
  });

  it('handle example', () => {
    const hail = [
      { position: { x: 19, y: 13, z: 30 }, velocity: { x: -2, y: 1, z: -2 } },
      { position: { x: 18, y: 19, z: 22 }, velocity: { x: -1, y: -1, z: -2 } },
      { position: { x: 20, y: 25, z: 34 }, velocity: { x: -2, y: -2, z: -4 } },
      { position: { x: 12, y: 31, z: 28 }, velocity: { x: -1, y: -2, z: -1 } },
      { position: { x: 20, y: 19, z: 15 }, velocity: { x: 1, y: -5, z: -3 } },
    ];
    expect(countXYAreaIntersections(hail, 7, 27)).toBe(2);
  });
});
