import { manhattanDistance, shoelaceArea } from '#utils/index.js';

type Instruction = {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
};

export function parseInstruction(line: string): Instruction {
  const [directionPart, distancePart] = line.split(' ');
  const direction = { L: 'left', R: 'right', U: 'up', D: 'down' }[
    directionPart
  ] as Instruction['direction'];
  const distance = Number.parseInt(distancePart);
  return { direction, distance };
}

export function parseCorrectInstruction(line: string): Instruction {
  const hexaDigits = line.split(' ')[2].replace(/[()#]/g, '');
  const direction = { 0: 'right', 1: 'down', 2: 'left', 3: 'up' }[
    hexaDigits[5]
  ] as Instruction['direction'];
  const distance = Number.parseInt('0x' + hexaDigits.substring(0, 5));
  return { direction, distance };
}

export function calcLagoonVolume(plan: Instruction[]): number {
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  const vertices = plan.reduce<[number, number][]>(
    (acc, { direction, distance }) => {
      let [row, col] = acc[acc.length - 1];
      switch (direction) {
        case 'left':
          col -= distance;
          break;
        case 'right':
          col += distance;
          break;
        case 'up':
          row -= distance;
          break;
        case 'down':
          row += distance;
          break;
      }
      acc.push([row, col]);
      return acc;
    },
    [[0, 0]]
  );
  const boundaryPoints = vertices.reduce((acc, [row, col], idx) => {
    const [prevRow, prevCol] = vertices[idx === 0 ? vertices.length - 1 : idx - 1];
    return acc + manhattanDistance([row, col], [prevRow, prevCol]);
  }, 0);
  const interiorPoints = shoelaceArea(vertices) - boundaryPoints / 2 + 1;
  return boundaryPoints + interiorPoints;
}
