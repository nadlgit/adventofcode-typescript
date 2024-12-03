export function parseProgramLine(line: string): string[] {
  return line.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g) ?? [];
}

export function execProgram(instructions: string[], allowConditional: boolean): number[] {
  const isInstructionEnabled = (instructionIndex: number) =>
    allowConditional
      ? instructions
          .slice(0, instructionIndex)
          .reverse()
          .find((instruction) => ['do()', "don't()"].includes(instruction)) !== "don't()"
      : true;

  const isMulInstruction = (instruction: string) => instruction.startsWith('mul(');

  const execMulInstruction = (instruction: string) =>
    instruction
      .replace('mul(', '')
      .replace(')', '')
      .split(',')
      .map((n) => Number.parseInt(n))
      .reduce((acc, n) => acc * n);

  return instructions.reduce<number[]>((acc, instruction, idx) => {
    if (isMulInstruction(instruction) && isInstructionEnabled(idx)) {
      acc.push(execMulInstruction(instruction));
    }
    return acc;
  }, []);
}
