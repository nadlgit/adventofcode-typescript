import { integerRange, ObjectSet } from '#utils/index.js';

type Coordinate = { x: number; y: number };

export function parseCaveScan(lines: string[]): Coordinate[] {
  const rocks: Coordinate[] = [];
  for (const line of lines.filter((line) => line.length > 0)) {
    const points = line.split(' -> ').map((str) => {
      const [x, y] = str.split(',');
      return { x: Number.parseInt(x), y: Number.parseInt(y) };
    });
    const path: Coordinate[] = [];
    for (const { x: currX, y: currY } of points) {
      const { x: prevX, y: prevY } =
        path.length > 0 ? path[path.length - 1] : { x: undefined, y: undefined };
      if (prevX === undefined) {
        path.push({ x: currX, y: currY });
      }
      if (prevX === currX) {
        for (const y of integerRange(prevY, currY).slice(1)) {
          path.push({ x: currX, y });
        }
      }
      if (prevY === currY) {
        for (const x of integerRange(prevX, currX).slice(1)) {
          path.push({ x, y: currY });
        }
      }
    }
    rocks.push(...path);
  }
  return rocks;
}

export class Cave {
  private readonly rockSet: Readonly<ObjectSet<Coordinate>>;
  private readonly sandSet: ObjectSet<Coordinate>;
  private readonly rockMaxY: Readonly<Record<number, number>>;
  private readonly floorY: number;

  constructor(rocks: Coordinate[], private readonly hasFloor = false) {
    this.rockSet = new ObjectSet(rocks);
    this.sandSet = new ObjectSet();
    this.rockMaxY = rocks.reduce<Record<number, number>>((acc, { x, y }) => {
      acc[x] = acc[x] ? Math.max(acc[x], y) : y;
      return acc;
    }, {});
    this.floorY = Math.max(...Object.values(this.rockMaxY)) + 2;
  }

  get sandResting(): Coordinate[] {
    return this.sandSet.values();
  }

  get sandRestingCount(): number {
    return this.sandSet.size;
  }

  produceSandUnit(): 'resting' | 'voided' | 'blocked' {
    const sandStart = { x: 500, y: 0 };
    if (!this.isAir(sandStart)) {
      return 'blocked';
    }

    let sand = sandStart;
    let isMoving = true;
    while (isMoving) {
      if (this.isVoid(sand)) {
        return 'voided';
      }

      const tileDown = { x: sand.x, y: sand.y + 1 };
      const tileDownLeft = { x: sand.x - 1, y: sand.y + 1 };
      const tileDownRight = { x: sand.x + 1, y: sand.y + 1 };
      if (this.isAir(tileDown)) {
        sand = tileDown;
      } else if (this.isAir(tileDownLeft)) {
        sand = tileDownLeft;
      } else if (this.isAir(tileDownRight)) {
        sand = tileDownRight;
      } else {
        isMoving = false;
      }
    }

    this.sandSet.add(sand);
    return 'resting';
  }

  private isAir({ x, y }: Coordinate): boolean {
    return (
      !this.rockSet.has({ x, y }) &&
      !this.sandSet.has({ x, y }) &&
      (!this.hasFloor || y !== this.floorY)
    );
  }

  private isVoid({ x, y }: Coordinate): boolean {
    return !this.hasFloor && y > (this.rockMaxY[x] ?? 0);
  }
}
