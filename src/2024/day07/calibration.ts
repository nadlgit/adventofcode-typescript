export type CalibrationEquation = {
  testValue: number;
  operands: number[];
};

export function parseCalibrationEquations(lines: string[]): CalibrationEquation[] {
  return lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const [testValue, operands] = line.split(': ');
      return {
        testValue: Number.parseInt(testValue),
        operands: operands.split(' ').map((n) => Number.parseInt(n)),
      };
    });
}

function calculate(operands: number[], withConcatOperator: boolean): number[] {
  if (operands.length <= 1) {
    return operands;
  }
  const lastOperand = operands[operands.length - 1];
  return calculate(operands.slice(0, operands.length - 1), withConcatOperator).flatMap((n) => {
    const result = [n + lastOperand, n * lastOperand];
    if (withConcatOperator) {
      result.push(Number.parseInt(n.toString() + lastOperand.toString()));
    }
    return result;
  });
}

export function checkCalibrationEquation(
  { testValue, operands }: CalibrationEquation,
  withConcatOperator = false
): boolean {
  return calculate(operands, withConcatOperator).includes(testValue);
}
