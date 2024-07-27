import { GameManager, Monkey, parseMonkeys } from './monkeys.js';

describe('parseMonkeys()', () => {
  it('parses 1 monkey', () => {
    const lines = [
      'Monkey 0:',
      '  Starting items: 79, 98',
      '  Operation: new = old + 19',
      '  Test: divisible by 23',
      '    If true: throw to monkey 2',
      '    If false: throw to monkey 3',
    ];
    expect(parseMonkeys(lines)).toEqual([
      new Monkey(
        {
          operator: '+',
          operand: 19,
          divisibleBy: 23,
          monkeyIfTrue: 2,
          monkeyIfFalse: 3,
        },
        [79, 98]
      ),
    ]);
  });

  it('parses 2 monkeys', () => {
    const lines = [
      'Monkey 0:',
      '  Starting items: 79, 98',
      '  Operation: new = old + 19',
      '  Test: divisible by 23',
      '    If true: throw to monkey 2',
      '    If false: throw to monkey 3',
      '',
      'Monkey 2:',
      '  Starting items: 79, 60, 97',
      '  Operation: new = old * old',
      '  Test: divisible by 13',
      '    If true: throw to monkey 1',
      '    If false: throw to monkey 3',
    ];
    expect(parseMonkeys(lines)).toEqual([
      new Monkey(
        {
          operator: '+',
          operand: 19,
          divisibleBy: 23,
          monkeyIfTrue: 2,
          monkeyIfFalse: 3,
        },
        [79, 98]
      ),
      new Monkey(
        {
          operator: '*',
          operand: 'old',
          divisibleBy: 13,
          monkeyIfTrue: 1,
          monkeyIfFalse: 3,
        },
        [79, 60, 97]
      ),
    ]);
  });

  it('parses example', () => {
    const lines = [
      'Monkey 0:',
      '  Starting items: 79, 98',
      '  Operation: new = old * 19',
      '  Test: divisible by 23',
      '    If true: throw to monkey 2',
      '    If false: throw to monkey 3',
      '',
      'Monkey 1:',
      '  Starting items: 54, 65, 75, 74',
      '  Operation: new = old + 6',
      '  Test: divisible by 19',
      '    If true: throw to monkey 2',
      '    If false: throw to monkey 0',
      '',
      'Monkey 2:',
      '  Starting items: 79, 60, 97',
      '  Operation: new = old * old',
      '  Test: divisible by 13',
      '    If true: throw to monkey 1',
      '    If false: throw to monkey 3',
      '',
      'Monkey 3:',
      '  Starting items: 74',
      '  Operation: new = old + 3',
      '  Test: divisible by 17',
      '    If true: throw to monkey 0',
      '    If false: throw to monkey 1',
    ];
    expect(parseMonkeys(lines)).toEqual([
      new Monkey(
        { operator: '*', operand: 19, divisibleBy: 23, monkeyIfTrue: 2, monkeyIfFalse: 3 },
        [79, 98]
      ),
      new Monkey(
        { operator: '+', operand: 6, divisibleBy: 19, monkeyIfTrue: 2, monkeyIfFalse: 0 },
        [54, 65, 75, 74]
      ),
      new Monkey(
        { operator: '*', operand: 'old', divisibleBy: 13, monkeyIfTrue: 1, monkeyIfFalse: 3 },
        [79, 60, 97]
      ),
      new Monkey(
        { operator: '+', operand: 3, divisibleBy: 17, monkeyIfTrue: 0, monkeyIfFalse: 1 },
        [74]
      ),
    ]);
  });
});

describe('Monkey.increaseWorryLevel()', () => {
  it.each<{ operator: '+' | '*'; operand: number | 'old'; expected: number }>([
    { operator: '+', operand: 11, expected: 21 },
    { operator: '+', operand: 'old', expected: 20 },
    { operator: '*', operand: 11, expected: 110 },
    { operator: '*', operand: 'old', expected: 100 },
  ])('handles operator $operator and operand $operand', ({ operator, operand, expected }) => {
    const monkey = new Monkey(
      { operator, operand, divisibleBy: 1, monkeyIfTrue: 0, monkeyIfFalse: 0 },
      []
    );
    expect(monkey.increaseWorryLevel(10)).toBe(expected);
  });
});

describe('GameManager.playRounds()', () => {
  describe('handles example', () => {
    const createGame = (decreaseWorryVersion: 'part1' | 'part2') =>
      new GameManager(
        [
          new Monkey(
            { operator: '*', operand: 19, divisibleBy: 23, monkeyIfTrue: 2, monkeyIfFalse: 3 },
            [79, 98]
          ),
          new Monkey(
            { operator: '+', operand: 6, divisibleBy: 19, monkeyIfTrue: 2, monkeyIfFalse: 0 },
            [54, 65, 75, 74]
          ),
          new Monkey(
            { operator: '*', operand: 'old', divisibleBy: 13, monkeyIfTrue: 1, monkeyIfFalse: 3 },
            [79, 60, 97]
          ),
          new Monkey(
            { operator: '+', operand: 3, divisibleBy: 17, monkeyIfTrue: 0, monkeyIfFalse: 1 },
            [74]
          ),
        ],
        decreaseWorryVersion
      );

    describe('worry level decrease rule = part1', () => {
      let game: GameManager;
      beforeEach(() => {
        game = createGame('part1');
      });

      it('1 round updates monkeys items', () => {
        game.playRounds(1);
        expect(game.monkeysCurrentIems).toEqual([
          [20, 23, 27, 26],
          [2080, 25, 167, 207, 401, 1046],
          [],
          [],
        ]);
      });

      it.each([
        [1, [2, 4, 3, 5]],
        [20, [101, 95, 7, 105]],
      ])('%i round(s) updates monkeys inspections count', (rounds, expected) => {
        game.playRounds(rounds);
        expect(game.monkeysInspections).toEqual(expected);
      });
    });

    describe('worry level decrease rule = part2', () => {
      let game: GameManager;
      beforeEach(() => {
        game = createGame('part2');
      });

      it.each([
        [1, [2, 4, 3, 6]],
        [20, [99, 97, 8, 103]],
        [1000, [5204, 4792, 199, 5192]],
        [10000, [52166, 47830, 1938, 52013]],
      ])('%i round(s) updates monkeys inspections count', (rounds, expected) => {
        game.playRounds(rounds);
        expect(game.monkeysInspections).toEqual(expected);
      });
    });
  });
});
