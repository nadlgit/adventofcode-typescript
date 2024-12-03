import { execProgram, parseProgramLine } from './corrupted-program.js';

describe('parseProgramLine()', () => {
  it.each(['mul(2,4)', 'mul(345,123)'])('parse mul() instruction: %s', (instruction) => {
    expect(parseProgramLine(instruction)).toEqual([instruction]);
  });

  it.each(['mul ( 2 , 4 )', 'mul?(12,34)', 'mul(6,9!)', 'mul(4*,1)'])(
    'dont parse mul() instruction with invalid characters: %s',
    (instruction) => {
      expect(parseProgramLine(instruction)).toEqual([]);
    }
  );

  it('parse do() instruction', () => {
    expect(parseProgramLine('do()')).toEqual(['do()']);
  });

  it('parse dont() instruction', () => {
    expect(parseProgramLine("don't()")).toEqual(["don't()"]);
  });

  it('parse line with multiple occurrences of each instruction', () => {
    expect(
      parseProgramLine("mul(2,4)don't()mul(345,123)do()mul(1,1)don't()mul(5,10)do()mul(11,7)")
    ).toEqual([
      'mul(2,4)',
      "don't()",
      'mul(345,123)',
      'do()',
      'mul(1,1)',
      "don't()",
      'mul(5,10)',
      'do()',
      'mul(11,7)',
    ]);
  });

  it('handle example 1', () => {
    expect(
      parseProgramLine('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))')
    ).toEqual(['mul(2,4)', 'mul(5,5)', 'mul(11,8)', 'mul(8,5)']);
  });

  it('handle example 2', () => {
    expect(
      parseProgramLine("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))")
    ).toEqual(['mul(2,4)', "don't()", 'mul(5,5)', 'mul(11,8)', 'do()', 'mul(8,5)']);
  });
});

describe('execProgram() without conditionals', () => {
  const expectExecProgram = (instructions: string[], result: number[]) => {
    expect(execProgram(instructions, false)).toEqual(result);
  };

  it('multiply mul() instruction parameters', () => {
    expectExecProgram(['mul(345,123)'], [345 * 123]);
  });

  it('handle example 1', () => {
    expectExecProgram(
      ['mul(2,4)', 'mul(5,5)', 'mul(11,8)', 'mul(8,5)'],
      [2 * 4, 5 * 5, 11 * 8, 8 * 5]
    );
  });
});

describe('execProgram() with conditionals', () => {
  const expectExecProgram = (instructions: string[], result: number[]) => {
    expect(execProgram(instructions, true)).toEqual(result);
  };

  it('multiply mul() instruction parameters', () => {
    expectExecProgram(['mul(345,123)'], [345 * 123]);
  });

  it('ignore mul() instructions preceded by dont() instruction', () => {
    expectExecProgram(
      ['mul(345,123)', "don't()", 'mul(2,4)', 'mul(1,1)', 'mul(5,10)'],
      [345 * 123]
    );
  });

  it('re-enable mul() instructions preceded by do() instruction', () => {
    expectExecProgram(
      ['mul(345,123)', "don't()", 'mul(2,4)', 'do()', 'mul(1,1)', 'mul(5,10)'],
      [345 * 123, 1 * 1, 5 * 10]
    );
  });

  it('handle example 2', () => {
    expectExecProgram(
      ['mul(2,4)', "don't()", 'mul(5,5)', 'mul(11,8)', 'do()', 'mul(8,5)'],
      [2 * 4, 8 * 5]
    );
  });
});
