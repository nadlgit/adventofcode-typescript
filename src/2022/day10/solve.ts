import { getInputLines } from '#utils/index.js';

export function solvePart1(filepath: string) {
  const program = new CpuProgram(getInputLines(filepath));
  let signalStrengthSum = 20 * program.tick(19);
  for (let cycle = 60; cycle <= 220; cycle += 40) {
    signalStrengthSum += cycle * program.tick(40);
  }
  return signalStrengthSum;
}

export function solvePart2(filepath: string) {
  const program = new CpuProgram(getInputLines(filepath));
  const spritePositions = Array.from(new Array(6), (_, rIdx) =>
    Array.from(new Array(40), (_, cIdx) => (rIdx === 0 && cIdx === 0 ? 1 : program.tick(1)))
  );
  const pixels = spritePositions.map((row) =>
    row
      .map((spriteMid, cIdx) =>
        [spriteMid - 1, spriteMid, spriteMid + 1].includes(cIdx) ? '#' : '.'
      )
      .join('')
  );
  return pixels;
}

class CpuProgram {
  private X = 1;
  private executionQueue: (() => void)[] = [];
  private readonly noop = () => {};

  constructor(instructions: string[]) {
    for (const line of instructions) {
      const [instr, value] = line.split(' ');
      if (instr === 'noop') {
        this.executionQueue.push(this.noop);
      }
      if (instr === 'addx') {
        this.executionQueue.push(
          this.noop, // instruction first cycle
          () => {
            this.X += Number.parseInt(value);
          }
        );
      }
    }
  }

  tick(cycles: number): number {
    for (let i = 0; i < cycles; i++) {
      const cycleOperation = this.executionQueue.shift() ?? this.noop;
      cycleOperation();
    }
    return this.X;
  }
}
