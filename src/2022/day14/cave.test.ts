import { Cave, parseCaveScan } from './cave.js';

describe('parseCaveScan()', () => {
  describe('parses single line rock path', () => {
    it('up to down', () => {
      expect(parseCaveScan(['498,4 -> 498,6'])).toIncludeSameMembers([
        { x: 498, y: 4 },
        { x: 498, y: 5 },
        { x: 498, y: 6 },
      ]);
    });

    it('down to up', () => {
      expect(parseCaveScan(['498,8 -> 498,6'])).toIncludeSameMembers([
        { x: 498, y: 8 },
        { x: 498, y: 7 },
        { x: 498, y: 6 },
      ]);
    });

    it('left to right', () => {
      expect(parseCaveScan(['498,6 -> 500,6'])).toIncludeSameMembers([
        { x: 498, y: 6 },
        { x: 499, y: 6 },
        { x: 500, y: 6 },
      ]);
    });

    it('right to left', () => {
      expect(parseCaveScan(['498,6 -> 496,6'])).toIncludeSameMembers([
        { x: 498, y: 6 },
        { x: 497, y: 6 },
        { x: 496, y: 6 },
      ]);
    });
  });

  it('parses perpendicular 2-line rock path', () => {
    expect(parseCaveScan(['498,4 -> 498,6 -> 500,6'])).toIncludeSameMembers([
      { x: 498, y: 4 },
      { x: 498, y: 5 },
      { x: 498, y: 6 },
      { x: 499, y: 6 },
      { x: 500, y: 6 },
    ]);
  });

  it('parses 2 separate rock paths', () => {
    expect(parseCaveScan(['498,4 -> 498,6', '503,4 -> 501,4'])).toIncludeSameMembers([
      { x: 498, y: 4 },
      { x: 498, y: 5 },
      { x: 498, y: 6 },
      { x: 503, y: 4 },
      { x: 502, y: 4 },
      { x: 501, y: 4 },
    ]);
  });

  it('parses example', () => {
    expect(
      parseCaveScan(['498,4 -> 498,6 -> 496,6', '503,4 -> 502,4 -> 502,9 -> 494,9'])
    ).toIncludeSameMembers([
      { x: 498, y: 4 },
      { x: 498, y: 5 },
      { x: 498, y: 6 },
      { x: 497, y: 6 },
      { x: 496, y: 6 },
      { x: 503, y: 4 },
      { x: 502, y: 4 },
      { x: 502, y: 5 },
      { x: 502, y: 6 },
      { x: 502, y: 7 },
      { x: 502, y: 8 },
      { x: 502, y: 9 },
      { x: 501, y: 9 },
      { x: 500, y: 9 },
      { x: 499, y: 9 },
      { x: 498, y: 9 },
      { x: 497, y: 9 },
      { x: 496, y: 9 },
      { x: 495, y: 9 },
      { x: 494, y: 9 },
    ]);
  });
});

describe('Cave.produceSandUnit()', () => {
  describe('handles sand move rules', () => {
    it('falls down until all 3 tiles below are blocked', () => {
      const cave = new Cave([
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
      ]);
      expect(cave.produceSandUnit()).toBe('resting');
      expect(cave.sandResting).toIncludeSameMembers([{ x: 500, y: 9 }]);
    });

    it('falls down left given tile below is blocked', () => {
      const cave = new Cave([
        { x: 498, y: 10 },
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
      ]);
      for (let i = 1; i <= 2; i++) {
        expect(cave.produceSandUnit()).toBe('resting');
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 499, y: 9 },
      ]);
    });

    it('falls down right given 2 tiles below is blocked', () => {
      const cave = new Cave([
        { x: 498, y: 10 },
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
        { x: 502, y: 10 },
      ]);
      for (let i = 1; i <= 3; i++) {
        expect(cave.produceSandUnit()).toBe('resting');
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 499, y: 9 },
        { x: 501, y: 9 },
      ]);
    });

    it('for several sand units in a row', () => {
      const cave = new Cave([
        { x: 497, y: 10 },
        { x: 498, y: 10 },
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
        { x: 502, y: 10 },
        { x: 503, y: 10 },
      ]);
      for (let i = 1; i <= 8; i++) {
        expect(cave.produceSandUnit()).toBe('resting');
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 499, y: 9 },
        { x: 501, y: 9 },
        { x: 500, y: 8 },
        { x: 498, y: 9 },
        { x: 499, y: 8 },
        { x: 502, y: 9 },
        { x: 501, y: 8 },
      ]);
    });
  });

  describe('detects void space', () => {
    it('on left side', () => {
      const cave = new Cave([
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
      ]);
      for (let i = 1; i <= 3; i++) {
        if (i > 1) {
          expect(cave.produceSandUnit()).toBe('voided');
        } else {
          expect(cave.produceSandUnit()).toBe('resting');
        }
      }
      expect(cave.sandResting).toIncludeSameMembers([{ x: 500, y: 9 }]);
    });

    it('on right side', () => {
      const cave = new Cave([
        { x: 498, y: 10 },
        { x: 499, y: 10 },
        { x: 500, y: 10 },
        { x: 501, y: 10 },
      ]);
      for (let i = 1; i <= 4; i++) {
        if (i > 2) {
          expect(cave.produceSandUnit()).toBe('voided');
        } else {
          expect(cave.produceSandUnit()).toBe('resting');
        }
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 499, y: 9 },
      ]);
    });
  });

  it('detects blocked source of sand', () => {
    const cave = new Cave([
      { x: 499, y: 1 },
      { x: 500, y: 1 },
      { x: 501, y: 1 },
    ]);
    for (let i = 1; i <= 3; i++) {
      if (i > 1) {
        expect(cave.produceSandUnit()).toBe('blocked');
      } else {
        expect(cave.produceSandUnit()).toBe('resting');
      }
    }
    expect(cave.sandResting).toIncludeSameMembers([{ x: 500, y: 0 }]);
  });

  describe('detects floor', () => {
    it('on left side', () => {
      const cave = new Cave(
        [
          { x: 499, y: 10 },
          { x: 500, y: 10 },
          { x: 501, y: 10 },
        ],
        true
      );
      for (let i = 1; i <= 2; i++) {
        expect(cave.produceSandUnit()).toBe('resting');
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 498, y: 11 },
      ]);
    });

    it('on right side', () => {
      const cave = new Cave(
        [
          { x: 498, y: 10 },
          { x: 499, y: 10 },
          { x: 500, y: 10 },
          { x: 501, y: 10 },
        ],
        true
      );
      for (let i = 1; i <= 3; i++) {
        expect(cave.produceSandUnit()).toBe('resting');
      }
      expect(cave.sandResting).toIncludeSameMembers([
        { x: 500, y: 9 },
        { x: 499, y: 9 },
        { x: 502, y: 11 },
      ]);
    });
  });

  describe('handles example', () => {
    const rocks = [
      { x: 498, y: 4 },
      { x: 498, y: 5 },
      { x: 498, y: 6 },
      { x: 497, y: 6 },
      { x: 496, y: 6 },
      { x: 503, y: 4 },
      { x: 502, y: 4 },
      { x: 502, y: 5 },
      { x: 502, y: 6 },
      { x: 502, y: 7 },
      { x: 502, y: 8 },
      { x: 502, y: 9 },
      { x: 501, y: 9 },
      { x: 500, y: 9 },
      { x: 499, y: 9 },
      { x: 498, y: 9 },
      { x: 497, y: 9 },
      { x: 496, y: 9 },
      { x: 495, y: 9 },
      { x: 494, y: 9 },
    ];

    it('part1 (void version)', () => {
      const EXPECTED_SAND_COUNT = 24;
      const cave = new Cave(rocks);
      for (let i = 1; i <= 2 + EXPECTED_SAND_COUNT; i++) {
        if (i > EXPECTED_SAND_COUNT) {
          expect(cave.produceSandUnit()).toBe('voided');
        } else {
          expect(cave.produceSandUnit()).toBe('resting');
        }
      }
      expect(cave.sandRestingCount).toBe(EXPECTED_SAND_COUNT);
    });

    it('part2 (floor version)', () => {
      const EXPECTED_SAND_COUNT = 93;
      const cave = new Cave(rocks, true);
      for (let i = 1; i <= 2 + EXPECTED_SAND_COUNT; i++) {
        if (i > EXPECTED_SAND_COUNT) {
          expect(cave.produceSandUnit()).toBe('blocked');
        } else {
          expect(cave.produceSandUnit()).toBe('resting');
        }
      }
      expect(cave.sandRestingCount).toBe(EXPECTED_SAND_COUNT);
    });
  });
});
