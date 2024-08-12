import { integerRange } from '#utils/index.js';

export type BrickPosition = Readonly<{
  x: Readonly<[number, number]>;
  y: Readonly<[number, number]>;
  z: Readonly<[number, number]>;
}>;

export function parseBricksSnapshot(lines: string[]): BrickPosition[] {
  const bricks: BrickPosition[] = [];
  for (const line of lines) {
    if (line.trim().length > 0) {
      const [[x1, y1, z1], [x2, y2, z2]] = line
        .split('~')
        .map((cube) => cube.split(',').map((n) => Number.parseInt(n)));
      bricks.push({ x: [x1, x2], y: [y1, y2], z: [z1, z2] });
    }
  }
  return bricks;
}

export function processBricksFall(snapshot: Readonly<BrickPosition[]>): BrickPosition[] {
  const sortedSnapshot = [...snapshot].sort(
    ({ z: [az1, az2] }, { z: [bz1, bz2] }) => Math.min(az1, az2) - Math.min(bz1, bz2)
  );
  const restingBricks: BrickPosition[] = [];
  let zHistory: Partial<Record<number, Partial<Record<number, number>>>> = {};
  for (const {
    x: [x1, x2],
    y: [y1, y2],
    z: [z1, z2],
  } of sortedSnapshot) {
    const xyList = integerRange(x1, x2).flatMap((x) => integerRange(y1, y2).map((y) => ({ x, y })));
    const zPrevMax = xyList.reduce((acc, { x, y }) => {
      return Math.max(acc, zHistory[x]?.[y] ?? 0);
    }, 0);
    const zDelta = Math.max(0, Math.min(z1, z2) - zPrevMax - 1);
    restingBricks.push({ x: [x1, x2], y: [y1, y2], z: [z1 - zDelta, z2 - zDelta] });
    zHistory = xyList.reduce((acc, { x, y }) => {
      acc[x] = { ...acc[x], [y]: Math.max(acc[x]?.[y] ?? 0, Math.max(z1, z2) - zDelta) };
      return acc;
    }, zHistory);
  }
  return restingBricks;
}

export function findBricksAbove(
  allBricks: Readonly<BrickPosition[]>,
  brick: BrickPosition
): BrickPosition[] {
  const {
    x: [x1, x2],
    y: [y1, y2],
    z: [z1, z2],
  } = brick;
  const xyList = integerRange(x1, x2).flatMap((x) => integerRange(y1, y2).map((y) => ({ x, y })));
  return allBricks.filter(
    ({ x: [ox1, ox2], y: [oy1, oy2], z: [oz1, oz2] }) =>
      (x1 !== ox1 || x2 !== ox2 || y1 !== oy1 || y2 !== oy2 || z1 !== oz1 || z2 !== oz2) &&
      Math.max(z1, z2) === Math.min(oz1, oz2) - 1 &&
      xyList.some(
        ({ x, y }) =>
          x >= Math.min(ox1, ox2) &&
          x <= Math.max(ox1, ox2) &&
          y >= Math.min(oy1, oy2) &&
          y <= Math.max(oy1, oy2)
      )
  );
}

export class BricksGraph {
  private readonly supportsAdjList: Map<BrickPosition, Set<BrickPosition>> = new Map();
  private readonly supportedByAdjList: Map<BrickPosition, Set<BrickPosition>> = new Map();

  constructor(bricks: Readonly<BrickPosition[]>) {
    for (const brick of bricks) {
      const bricksAbove = findBricksAbove(bricks, brick);
      this.supportsAdjList.set(brick, new Set(bricksAbove));
      for (const above of bricksAbove) {
        const bricksBelow = this.supportedByAdjList.get(above) ?? new Set();
        bricksBelow.add(brick);
        this.supportedByAdjList.set(above, bricksBelow);
      }
    }
  }

  get bricks(): BrickPosition[] {
    return [...this.supportsAdjList.keys()];
  }

  isSafeToDisintegrate(brick: BrickPosition): boolean {
    return this.getMatchingBricksAbove(brick, (b) => b === brick).length === 0;
  }

  findDisintegrationImpact(brick: BrickPosition): BrickPosition[] {
    const bricksImpacted: Set<BrickPosition> = new Set();
    const queue = [brick];
    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const current = queue.shift()!;
      bricksImpacted.add(current);
      for (const above of this.getMatchingBricksAbove(current, (b) => bricksImpacted.has(b))) {
        queue.push(above);
      }
    }
    bricksImpacted.delete(brick);
    return [...bricksImpacted];
  }

  private getMatchingBricksAbove(
    brick: BrickPosition,
    belowFilterFn: (b: BrickPosition) => boolean
  ): BrickPosition[] {
    return this.getBricksAbove(brick).filter((b) => this.getBricksBelow(b).every(belowFilterFn));
  }

  private getBricksAbove(brick: BrickPosition): BrickPosition[] {
    return [...(this.supportsAdjList.get(brick) ?? new Set())];
  }

  private getBricksBelow(brick: BrickPosition): BrickPosition[] {
    return [...(this.supportedByAdjList.get(brick) ?? new Set())];
  }
}
