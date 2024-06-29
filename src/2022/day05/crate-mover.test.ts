import {
  applyMoveV9000,
  applyMoveV9001,
  getStacksTopCrates,
  parseCrateInstructions,
} from './crate-mover.js';

describe('parseCrateInstructions()', () => {
  describe('handles example', () => {
    const lines: string[] = [
      '    [D]    ',
      '[N] [C]    ',
      '[Z] [M] [P]',
      ' 1   2   3 ',
      '',
      'move 1 from 2 to 1',
      'move 3 from 1 to 3',
      'move 2 from 2 to 1',
      'move 1 from 1 to 2',
    ] as const;

    it('parses stacks', () => {
      expect(parseCrateInstructions(lines).stacks).toEqual([
        { id: 1, content: ['Z', 'N'] },
        { id: 2, content: ['M', 'C', 'D'] },
        { id: 3, content: ['P'] },
      ]);
    });

    it('parses instructions', () => {
      expect(parseCrateInstructions(lines).instructions).toEqual([
        { orig: 2, dest: 1, count: 1 },
        { orig: 1, dest: 3, count: 3 },
        { orig: 2, dest: 1, count: 2 },
        { orig: 1, dest: 2, count: 1 },
      ]);
    });
  });
});

describe('applyMoveV9000()', () => {
  it('moves 1 crate', () => {
    const stacks = [
      { id: 1, content: ['A', 'B', 'C'] },
      { id: 2, content: ['D', 'E', 'F'] },
    ];
    applyMoveV9000({ orig: 1, dest: 2, count: 1 }, stacks);
    expect(stacks).toEqual([
      { id: 1, content: ['A', 'B'] },
      { id: 2, content: ['D', 'E', 'F', 'C'] },
    ]);
  });

  it('moves 2 crates', () => {
    const stacks = [
      { id: 1, content: ['A', 'B', 'C'] },
      { id: 2, content: ['D', 'E', 'F'] },
    ];
    applyMoveV9000({ orig: 1, dest: 2, count: 2 }, stacks);
    expect(stacks).toEqual([
      { id: 1, content: ['A'] },
      { id: 2, content: ['D', 'E', 'F', 'C', 'B'] },
    ]);
  });
});

describe('applyMoveV9001()', () => {
  it('moves 1 crate', () => {
    const stacks = [
      { id: 1, content: ['A', 'B', 'C'] },
      { id: 2, content: ['D', 'E', 'F'] },
    ];
    applyMoveV9001({ orig: 1, dest: 2, count: 1 }, stacks);
    expect(stacks).toEqual([
      { id: 1, content: ['A', 'B'] },
      { id: 2, content: ['D', 'E', 'F', 'C'] },
    ]);
  });

  it('moves 2 crates', () => {
    const stacks = [
      { id: 1, content: ['A', 'B', 'C'] },
      { id: 2, content: ['D', 'E', 'F'] },
    ];
    applyMoveV9001({ orig: 1, dest: 2, count: 2 }, stacks);
    expect(stacks).toEqual([
      { id: 1, content: ['A'] },
      { id: 2, content: ['D', 'E', 'F', 'B', 'C'] },
    ]);
  });
});

describe('getStacksTopCrates()', () => {
  it('returns each stack top crate', () => {
    expect(
      getStacksTopCrates([
        { id: 1, content: ['A', 'B'] },
        { id: 2, content: ['C'] },
      ])
    ).toEqual(['B', 'C']);
  });

  it('orders by stack id', () => {
    expect(
      getStacksTopCrates([
        { id: 2, content: ['A', 'B'] },
        { id: 1, content: ['C'] },
      ])
    ).toEqual(['C', 'B']);
  });
});
