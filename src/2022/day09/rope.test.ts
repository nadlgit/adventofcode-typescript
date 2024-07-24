import { parseMoveLine, RopeSimulation } from './rope.js';

describe('parseMoveLine()', () => {
  it.each([
    ['L 1', { direction: 'left', steps: 1 }],
    ['R 15', { direction: 'right', steps: 15 }],
    ['U 230', { direction: 'up', steps: 230 }],
    ['D 9', { direction: 'down', steps: 9 }],
  ])("parses '%s'", (line, expected) => {
    expect(parseMoveLine(line)).toEqual(expected);
  });
});

describe('RopeSimulation', () => {
  describe('constructor', () => {
    it.each([2, 10])('initializes knots position given %i knots', (nbKnots) => {
      const rope = new RopeSimulation(nbKnots);
      const positions = rope.getKnotsPosition();
      expect(positions).toHaveLength(nbKnots);
      for (const pos of positions) {
        expect(pos).toEqual([0, 0]);
      }
    });

    it.each([2, 10])('initializes tail visited count given %i knots', (nbKnots) => {
      const rope = new RopeSimulation(nbKnots);
      expect(rope.countTailVisitedPositions()).toBe(1);
    });
  });

  describe('handleMove()', () => {
    describe('moves head', () => {
      let rope: RopeSimulation;
      const getPosition = () => rope.getKnotsPosition()[0];
      beforeEach(() => {
        rope = new RopeSimulation(2);
      });

      it.each<['left' | 'right' | 'up' | 'down', number]>([
        ['left', 1],
        ['left', 5],
        ['right', 1],
        ['right', 5],
        ['up', 1],
        ['up', 5],
        ['down', 1],
        ['down', 5],
      ])('%s %i step(s)', (direction, steps) => {
        rope.handleMove({ direction, steps });
        const expected = {
          left: [0, -steps],
          right: [0, steps],
          up: [-steps, 0],
          down: [steps, 0],
        } as const;
        expect(getPosition()).toEqual(expected[direction]);
      });

      it('given 2 moves in different directions', () => {
        rope.handleMove({ direction: 'down', steps: 3 });
        rope.handleMove({ direction: 'right', steps: 2 });
        expect(getPosition()).toEqual([3, 2]);
      });
    });

    describe('doesnt move knot following head (tail given 2 knots)', () => {
      let rope: RopeSimulation;
      const getPosition = () => rope.getKnotsPosition()[1];
      beforeEach(() => {
        rope = new RopeSimulation(2);
      });

      it.each<'left' | 'right' | 'up' | 'down'>(['left', 'right', 'up', 'down'])(
        'given head moving %s 1 step',
        (direction) => {
          rope.handleMove({ direction, steps: 1 });
          expect(getPosition()).toEqual([0, 0]);
        }
      );

      it.each<['left' | 'right', 'up' | 'down']>([
        ['left', 'up'],
        ['left', 'down'],
        ['right', 'up'],
        ['right', 'down'],
      ])('given head moving %s %s 1 step', (direction1, direction2) => {
        rope.handleMove({ direction: direction1, steps: 1 });
        rope.handleMove({ direction: direction2, steps: 1 });
        expect(getPosition()).toEqual([0, 0]);
      });

      it('given head moving 1 step back', () => {
        rope.handleMove({ direction: 'down', steps: 1 });
        rope.handleMove({ direction: 'up', steps: 1 });
        expect(getPosition()).toEqual([0, 0]);
      });
    });

    describe('moves knot following head (tail given 2 knots)', () => {
      let rope: RopeSimulation;
      const getPosition = () => rope.getKnotsPosition()[1];
      beforeEach(() => {
        rope = new RopeSimulation(2);
      });

      it.each<'left' | 'right' | 'up' | 'down'>(['left', 'right', 'up', 'down'])(
        'given head %s moving that way 1 step',
        (direction) => {
          rope.handleMove({ direction, steps: 1 });
          rope.handleMove({ direction, steps: 1 });
          const expected = {
            left: [0, -1],
            right: [0, 1],
            up: [-1, 0],
            down: [1, 0],
          } as const;
          expect(getPosition()).toEqual(expected[direction]);
        }
      );

      describe.each<['left' | 'right', 'up' | 'down']>([
        ['left', 'up'],
        ['left', 'down'],
        ['right', 'up'],
        ['right', 'down'],
      ])('given head %s %s', (direction1, direction2) => {
        it.each([direction1, direction2])('moving %s 1 step', (direction) => {
          rope.handleMove({ direction: direction1, steps: 1 });
          rope.handleMove({ direction: direction2, steps: 1 });
          rope.handleMove({ direction, steps: 1 });
          const expected = {
            left: {
              up: [-1, -1],
              down: [1, -1],
            },
            right: {
              up: [-1, 1],
              down: [1, 1],
            },
          } as const;
          expect(getPosition()).toEqual(expected[direction1][direction2]);
        });
      });
    });

    describe('moves 2nd knot following head', () => {
      let rope: RopeSimulation;
      const getPosition = () => rope.getKnotsPosition()[2];
      beforeEach(() => {
        rope = new RopeSimulation(3);
      });

      it.each<'left' | 'right' | 'up' | 'down'>(['left', 'right', 'up', 'down'])(
        'given previous knot %s moving that way 1 step',
        (direction) => {
          rope.handleMove({ direction, steps: 2 });
          rope.handleMove({ direction, steps: 1 });
          const expected = {
            left: [0, -1],
            right: [0, 1],
            up: [-1, 0],
            down: [1, 0],
          } as const;
          expect(getPosition()).toEqual(expected[direction]);
        }
      );

      describe.each<['left' | 'right', 'up' | 'down']>([
        ['left', 'up'],
        ['left', 'down'],
        ['right', 'up'],
        ['right', 'down'],
      ])('given previous knot %s %s', (direction1, direction2) => {
        it.each([direction1, direction2])('moving %s 1 step', (direction) => {
          for (let i = 0; i < 2; i++) {
            rope.handleMove({ direction: direction1, steps: 1 });
            rope.handleMove({ direction: direction2, steps: 1 });
          }
          rope.handleMove({ direction, steps: 1 });
          const expected = {
            left: {
              up: [-1, -1],
              down: [1, -1],
            },
            right: {
              up: [-1, 1],
              down: [1, 1],
            },
          } as const;
          expect(getPosition()).toEqual(expected[direction1][direction2]);
        });
      });
    });

    it('updates tail visited count', () => {
      const rope = new RopeSimulation(2);
      rope.handleMove({ direction: 'up', steps: 5 });
      expect(rope.countTailVisitedPositions()).toBe(5);
    });
  });
});

describe('Processing example 1 given 2 knots', () => {
  const moves = ['R 4', 'U 4', 'L 3', 'D 1', 'R 4', 'D 1', 'L 5', 'R 2'].map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (line) => parseMoveLine(line)!
  );

  it.each([
    [1, [0, 4], [0, 3]],
    [2, [-4, 4], [-3, 4]],
    [3, [-4, 1], [-4, 2]],
    [4, [-3, 1], [-4, 2]],
    [5, [-3, 5], [-3, 4]],
    [6, [-2, 5], [-3, 4]],
    [7, [-2, 0], [-2, 1]],
    [8, [-2, 2], [-2, 1]],
  ])('handles motion %i', (motion, expectedHead, expectedTail) => {
    const rope = new RopeSimulation(2);
    for (let i = 0; i < motion; i++) {
      rope.handleMove(moves[i]);
    }
    expect(rope.getKnotsPosition()).toEqual([expectedHead, expectedTail]);
  });
});

describe('Processing example 1 given 10 knots', () => {
  const moves = ['R 4', 'U 4', 'L 3', 'D 1', 'R 4', 'D 1', 'L 5', 'R 2'].map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (line) => parseMoveLine(line)!
  );

  it.each([
    [
      1,
      [
        [0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      2,
      [
        [-4, 4],
        [-3, 4],
        [-2, 4],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      3,
      [
        [-4, 1],
        [-4, 2],
        [-3, 3],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      4,
      [
        [-3, 1],
        [-4, 2],
        [-3, 3],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      5,
      [
        [-3, 5],
        [-3, 4],
        [-3, 3],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      6,
      [
        [-2, 5],
        [-3, 4],
        [-3, 3],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      7,
      [
        [-2, 0],
        [-2, 1],
        [-2, 2],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    [
      8,
      [
        [-2, 2],
        [-2, 1],
        [-2, 2],
        [-2, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
  ])('handles motion %i', (motion, expectedKnots) => {
    const rope = new RopeSimulation(10);
    for (let i = 0; i < motion; i++) {
      rope.handleMove(moves[i]);
    }
    expect(rope.getKnotsPosition()).toEqual(expectedKnots);
  });
});
