import {
  type BrickPosition,
  BricksGraph,
  findBricksAbove,
  parseBricksSnapshot,
  processBricksFall,
} from './sand-bricks.js';

describe('parseBricksSnapshot()', () => {
  it('parses 1 line', () => {
    expect(parseBricksSnapshot(['1,0,1~1,2,1'])).toEqual([{ x: [1, 1], y: [0, 2], z: [1, 1] }]);
  });

  it('ignores empty lines', () => {
    expect(parseBricksSnapshot(['', '1,0,1~1,2,1', ''])).toEqual([
      { x: [1, 1], y: [0, 2], z: [1, 1] },
    ]);
  });

  it('parses example', () => {
    expect(
      parseBricksSnapshot([
        '1,0,1~1,2,1',
        '0,0,2~2,0,2',
        '0,2,3~2,2,3',
        '0,0,4~0,2,4',
        '2,0,5~2,2,5',
        '0,1,6~2,1,6',
        '1,1,8~1,1,9',
      ])
    ).toEqual([
      { x: [1, 1], y: [0, 2], z: [1, 1] },
      { x: [0, 2], y: [0, 0], z: [2, 2] },
      { x: [0, 2], y: [2, 2], z: [3, 3] },
      { x: [0, 0], y: [0, 2], z: [4, 4] },
      { x: [2, 2], y: [0, 2], z: [5, 5] },
      { x: [0, 2], y: [1, 1], z: [6, 6] },
      { x: [1, 1], y: [1, 1], z: [8, 9] },
    ]);
  });
});

describe('processBricksFall()', () => {
  describe('given 1 brick resting on ground', () => {
    it.each<[string, Readonly<BrickPosition[]>]>([
      ['x-axis', [{ x: [0, 1], y: [0, 0], z: [1, 1] }]],
      ['y-axis', [{ x: [0, 0], y: [0, 1], z: [1, 1] }]],
      ['z-axis', [{ x: [0, 0], y: [0, 0], z: [1, 2] }]],
    ])('oriented %s', (_, snapshot) => {
      expect(processBricksFall(snapshot)).toEqual(snapshot);
    });
  });

  describe('given 1 brick falling', () => {
    it('oriented x-axis', () => {
      expect(processBricksFall([{ x: [0, 1], y: [0, 0], z: [3, 3] }])).toEqual([
        { x: [0, 1], y: [0, 0], z: [1, 1] },
      ]);
    });

    it('oriented y-axis', () => {
      expect(processBricksFall([{ x: [0, 0], y: [0, 1], z: [3, 3] }])).toEqual([
        { x: [0, 0], y: [0, 1], z: [1, 1] },
      ]);
    });

    it('oriented z-axis', () => {
      expect(processBricksFall([{ x: [0, 0], y: [0, 0], z: [3, 4] }])).toEqual([
        { x: [0, 0], y: [0, 0], z: [1, 2] },
      ]);
    });
  });

  describe('given 2 bricks', () => {
    it('both resting', () => {
      const snapshot: Readonly<BrickPosition[]> = [
        { x: [0, 1], y: [0, 0], z: [2, 2] },
        { x: [0, 0], y: [0, 1], z: [1, 1] },
      ];
      expect(processBricksFall(snapshot)).toIncludeSameMembers(snapshot);
    });

    it('1 resting and 1 falling', () => {
      expect(
        processBricksFall([
          { x: [0, 1], y: [0, 0], z: [3, 3] },
          { x: [0, 0], y: [0, 1], z: [1, 1] },
        ])
      ).toIncludeSameMembers([
        { x: [0, 1], y: [0, 0], z: [2, 2] },
        { x: [0, 0], y: [0, 1], z: [1, 1] },
      ]);
    });

    it('both falling', () => {
      expect(
        processBricksFall([
          { x: [0, 1], y: [0, 0], z: [4, 4] },
          { x: [0, 0], y: [0, 1], z: [2, 2] },
        ])
      ).toIncludeSameMembers([
        { x: [0, 1], y: [0, 0], z: [2, 2] },
        { x: [0, 0], y: [0, 1], z: [1, 1] },
      ]);
    });
  });

  it('handles example', () => {
    expect(
      processBricksFall([
        { x: [1, 1], y: [0, 2], z: [1, 1] },
        { x: [0, 2], y: [0, 0], z: [2, 2] },
        { x: [0, 2], y: [2, 2], z: [3, 3] },
        { x: [0, 0], y: [0, 2], z: [4, 4] },
        { x: [2, 2], y: [0, 2], z: [5, 5] },
        { x: [0, 2], y: [1, 1], z: [6, 6] },
        { x: [1, 1], y: [1, 1], z: [8, 9] },
      ])
    ).toIncludeSameMembers([
      { x: [1, 1], y: [0, 2], z: [1, 1] },
      { x: [0, 2], y: [0, 0], z: [2, 2] },
      { x: [0, 2], y: [2, 2], z: [2, 2] },
      { x: [0, 0], y: [0, 2], z: [3, 3] },
      { x: [2, 2], y: [0, 2], z: [3, 3] },
      { x: [0, 2], y: [1, 1], z: [4, 4] },
      { x: [1, 1], y: [1, 1], z: [5, 6] },
    ]);
  });
});

describe('findBricksAbove()', () => {
  it.each([
    ['A -> [B, C]', 0, [1, 2]],
    ['B -> [D, E]', 1, [3, 4]],
    ['C -> [D, E]', 2, [3, 4]],
    ['D -> [F]', 3, [5]],
    ['E -> [F]', 4, [5]],
    ['F -> [G]', 5, [6]],
    ['G -> []', 6, []],
  ])('handles example: %s', (_, brickIdx, expectedIdx) => {
    const bricks: Readonly<BrickPosition[]> = [
      { x: [1, 1], y: [0, 2], z: [1, 1] },
      { x: [0, 2], y: [0, 0], z: [2, 2] },
      { x: [0, 2], y: [2, 2], z: [2, 2] },
      { x: [0, 0], y: [0, 2], z: [3, 3] },
      { x: [2, 2], y: [0, 2], z: [3, 3] },
      { x: [0, 2], y: [1, 1], z: [4, 4] },
      { x: [1, 1], y: [1, 1], z: [5, 6] },
    ];
    const bricksAbove = findBricksAbove(bricks, bricks[brickIdx]);
    for (const brick of expectedIdx.map((idx) => bricks[idx])) {
      expect(bricksAbove).toContain(brick); // should be object reference
    }
  });
});

describe('BricksGraph.isSafeToDisintegrate()', () => {
  it.each([
    ['A', false, 0],
    ['B', true, 1],
    ['C', true, 2],
    ['D', true, 3],
    ['E', true, 4],
    ['F', false, 5],
    ['G', true, 6],
  ])('handles example: %s -> %s', (_, expected, brickIdx) => {
    const bricks: Readonly<BrickPosition[]> = [
      { x: [1, 1], y: [0, 2], z: [1, 1] },
      { x: [0, 2], y: [0, 0], z: [2, 2] },
      { x: [0, 2], y: [2, 2], z: [2, 2] },
      { x: [0, 0], y: [0, 2], z: [3, 3] },
      { x: [2, 2], y: [0, 2], z: [3, 3] },
      { x: [0, 2], y: [1, 1], z: [4, 4] },
      { x: [1, 1], y: [1, 1], z: [5, 6] },
    ];
    const graph = new BricksGraph(bricks);
    expect(graph.isSafeToDisintegrate(bricks[brickIdx])).toBe(expected);
  });
});

describe('BricksGraph.findDisintegrationImpact()', () => {
  it.each([
    ['A -> [B, C, D, E, F, G]', 0, [1, 2, 3, 4, 5, 6]],
    ['B -> []', 1, []],
    ['C -> []', 2, []],
    ['D -> []', 3, []],
    ['E -> []', 4, []],
    ['F -> [G]', 5, [6]],
    ['G -> []', 6, []],
  ])('handles example: %s', (_, brickIdx, expectedIdx) => {
    const bricks: Readonly<BrickPosition[]> = [
      { x: [1, 1], y: [0, 2], z: [1, 1] },
      { x: [0, 2], y: [0, 0], z: [2, 2] },
      { x: [0, 2], y: [2, 2], z: [2, 2] },
      { x: [0, 0], y: [0, 2], z: [3, 3] },
      { x: [2, 2], y: [0, 2], z: [3, 3] },
      { x: [0, 2], y: [1, 1], z: [4, 4] },
      { x: [1, 1], y: [1, 1], z: [5, 6] },
    ];
    const graph = new BricksGraph(bricks);
    expect(graph.findDisintegrationImpact(bricks[brickIdx])).toEqual(
      expectedIdx.map((idx) => bricks[idx])
    );
  });
});
