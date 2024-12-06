type Hailstone = Readonly<{
  position: Readonly<{ x: number; y: number; z: number }>;
  velocity: Readonly<{ x: number; y: number; z: number }>;
}>;
type Hail = ReadonlyArray<Hailstone>;

export function parseHail(lines: string[]): Hail {
  return lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const [px, py, pz, vx, vy, vz] = line
        .replaceAll(' ', '')
        .split('@')
        .flatMap((str) => str.split(',').map((n) => Number.parseInt(n)));
      return { position: { x: px, y: py, z: pz }, velocity: { x: vx, y: vy, z: vz } };
    });
}

export function solveXYLinearEquationSystem({
  a1,
  b1,
  c1,
  a2,
  b2,
  c2,
}: {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
}): { x: number; y: number } | 'none' | 'infinity' {
  // a1*x + b1*y + c1 = 0
  // a2*x + b2*y + c2 = 0

  const determinant = a1 * b2 - a2 * b1;
  const xNumeratorDeterminant = b1 * c2 - b2 * c1;
  const yNumeratorDeterminant = a2 * c1 - a1 * c2;

  if (determinant === 0) {
    return xNumeratorDeterminant === 0 && yNumeratorDeterminant === 0 ? 'infinity' : 'none';
  }

  const x = xNumeratorDeterminant / determinant;
  const y = yNumeratorDeterminant / determinant;
  return { x, y };
}

function getHailstoneXYEquation({ position, velocity }: Hailstone) {
  // a*x + b*y + c = 0
  const a = velocity.y;
  const b = -velocity.x;
  const c = -a * position.x - b * position.y;
  return { a, b, c };
}

function isHailstoneFutureXYPosition(
  { position, velocity }: Hailstone,
  otherPosition: { x: number; y: number }
) {
  return (
    Math.sign(otherPosition.x - position.x) === Math.sign(velocity.x) &&
    Math.sign(otherPosition.y - position.y) === Math.sign(velocity.y)
  );
}

export function findHailstoneXYIntersection(
  h1: Hailstone,
  h2: Hailstone
): { type: 'none' } | { type: 'future' | 'past'; x: number; y: number } {
  const { a: a1, b: b1, c: c1 } = getHailstoneXYEquation(h1);
  const { a: a2, b: b2, c: c2 } = getHailstoneXYEquation(h2);
  const result = solveXYLinearEquationSystem({ a1, b1, c1, a2, b2, c2 });

  if (result === 'none' || result === 'infinity') {
    return { type: 'none' };
  }

  const { x, y } = result;
  return {
    type:
      isHailstoneFutureXYPosition(h1, { x, y }) && isHailstoneFutureXYPosition(h2, { x, y })
        ? 'future'
        : 'past',
    x,
    y,
  };
}

function isInRange(n: number, [min, max]: [number, number]) {
  return n >= min && n <= max;
}

export function countXYAreaIntersections(hail: Hail, areaMin: number, areaMax: number) {
  let count = 0;
  for (let i = 0; i < hail.length - 1; i++) {
    for (let j = i + 1; j < hail.length; j++) {
      const intersection = findHailstoneXYIntersection(hail[i], hail[j]);
      if (
        intersection.type === 'future' &&
        isInRange(intersection.x, [areaMin, areaMax]) &&
        isInRange(intersection.y, [areaMin, areaMax])
      ) {
        count++;
      }
    }
  }
  return count;
}
