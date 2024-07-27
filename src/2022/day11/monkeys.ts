import { multiply } from '#utils/index.js';

type MonkeyConfig = {
  operator: '+' | '*';
  operand: 'old' | number;
  divisibleBy: number;
  monkeyIfTrue: number;
  monkeyIfFalse: number;
};

export function parseMonkeys(lines: string[]): Monkey[] {
  const monkeys: { items: number[]; config: Partial<MonkeyConfig> }[] = [];
  for (const line of lines) {
    if (line.startsWith('Monkey')) {
      monkeys.push({ items: [], config: {} });
    }
    if (line.trim().startsWith('Starting items')) {
      monkeys[monkeys.length - 1].items = line
        .replace('Starting items:', '')
        .trim()
        .split(', ')
        .map((n) => Number.parseInt(n));
    }
    if (line.trim().startsWith('Operation')) {
      const [operator, operand] = line.replace('Operation: new = old', '').trim().split(' ');
      monkeys[monkeys.length - 1].config.operator = operator as '+' | '*';
      monkeys[monkeys.length - 1].config.operand =
        operand === 'old' ? operand : Number.parseInt(operand);
    }
    if (line.trim().startsWith('Test')) {
      monkeys[monkeys.length - 1].config.divisibleBy = Number.parseInt(
        line.replace('Test: divisible by', '').trim()
      );
    }
    if (line.trim().startsWith('If true')) {
      monkeys[monkeys.length - 1].config.monkeyIfTrue = Number.parseInt(
        line.replace('If true: throw to monkey', '').trim()
      );
    }
    if (line.trim().startsWith('If false')) {
      monkeys[monkeys.length - 1].config.monkeyIfFalse = Number.parseInt(
        line.replace('If false: throw to monkey', '').trim()
      );
    }
  }
  return monkeys.map(({ items, config }) => new Monkey(config as MonkeyConfig, items));
}

export class Monkey {
  constructor(private readonly config: Readonly<MonkeyConfig>, private readonly items: number[]) {}

  get currentItems(): number[] {
    return [...this.items];
  }

  get divisibleBy(): number {
    return this.config.divisibleBy;
  }

  dequeueItem(): number | null {
    return this.items.shift() ?? null;
  }

  increaseWorryLevel(n: number): number {
    const { operator, operand } = this.config;
    return {
      '+': n + (operand === 'old' ? n : operand),
      '*': n * (operand === 'old' ? n : operand),
    }[operator];
  }

  testWorryLevel(n: number): number {
    const { divisibleBy, monkeyIfTrue, monkeyIfFalse } = this.config;
    return n % divisibleBy === 0 ? monkeyIfTrue : monkeyIfFalse;
  }

  enqueueItem(n: number): void {
    this.items.push(n);
  }
}

export class GameManager {
  private players: { monkey: Monkey; inspections: number }[];
  private decreaseWorryLevel: (n: number) => number;

  constructor(monkeys: Monkey[], decreaseWorryVersion: 'part1' | 'part2') {
    this.players = monkeys.map((monkey) => ({ monkey, inspections: 0 }));

    const commonDivisibleBy = multiply(monkeys.map(({ divisibleBy }) => divisibleBy));
    this.decreaseWorryLevel = {
      part1: (n: number) => Math.trunc(n / 3),
      part2: (n: number) => n % commonDivisibleBy,
    }[decreaseWorryVersion];
  }

  get monkeysCurrentIems(): number[][] {
    return this.players.map(({ monkey: { currentItems } }) => currentItems);
  }

  get monkeysInspections(): number[] {
    return this.players.map(({ inspections: itemsInspected }) => itemsInspected);
  }

  playRounds(rounds: number): void {
    for (let i = 0; i < rounds; i++) {
      for (const player of this.players) {
        const monkey = player.monkey;
        let worryLevel: number | null;
        while ((worryLevel = monkey.dequeueItem()) !== null) {
          player.inspections++;
          worryLevel = monkey.increaseWorryLevel(worryLevel);
          worryLevel = this.decreaseWorryLevel(worryLevel);
          const nextMonkey = monkey.testWorryLevel(worryLevel);
          this.players[nextMonkey].monkey.enqueueItem(worryLevel);
        }
      }
    }
  }

  calcMonkeyBusinessLevel(): number {
    const [top1, top2] = this.monkeysInspections.sort((a, b) => b - a).slice(0, 2);
    return top1 * top2;
  }
}
