type MoveInstruction = { direction: 'left' | 'right' | 'up' | 'down'; steps: number };
type Position = [number, number];

export function parseMoveLine(line: string): MoveInstruction | null {
  const steps = Number.parseInt(line.slice(2));
  switch (line[0]) {
    case 'L':
      return { direction: 'left', steps };
    case 'R':
      return { direction: 'right', steps };
    case 'U':
      return { direction: 'up', steps };
    case 'D':
      return { direction: 'down', steps };
    default:
      return null;
  }
}

export class RopeSimulation {
  private readonly knotsPosition: Position[];
  private readonly tailPosition: Readonly<Position>;
  private readonly tailVisited: Set<string>;

  constructor(nbKnots: number) {
    this.knotsPosition = Array.from(new Array(nbKnots), () => [0, 0]);
    this.tailPosition = this.knotsPosition[nbKnots - 1];
    this.tailVisited = new Set();
    this.updateTailVisited();
  }

  getKnotsPosition(): Readonly<Readonly<Position>[]> {
    return this.knotsPosition;
  }

  countTailVisitedPositions(): number {
    return this.tailVisited.size;
  }

  handleMove({ direction, steps }: MoveInstruction): void {
    for (let s = 0; s < steps; s++) {
      this.moveHead(direction);
      for (let i = 1; i < this.knotsPosition.length; i++) {
        this.moveKnot(this.knotsPosition[i], this.knotsPosition[i - 1]);
      }
      this.updateTailVisited();
    }
  }

  private updateTailVisited(): void {
    this.tailVisited.add(JSON.stringify(this.tailPosition));
  }

  private moveHead(direction: MoveInstruction['direction']): void {
    const head = this.knotsPosition[0];
    if (direction === 'left') {
      head[1]--;
    }
    if (direction === 'right') {
      head[1]++;
    }
    if (direction === 'up') {
      head[0]--;
    }
    if (direction === 'down') {
      head[0]++;
    }
  }

  private moveKnot(knot: Position, [prevRow, prevCol]: Position): void {
    const rowDiff = knot[0] - prevRow;
    const colDiff = knot[1] - prevCol;
    if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) {
      return;
    }
    knot[0] = Math.abs(rowDiff) > 1 ? prevRow + Math.sign(rowDiff) : prevRow;
    knot[1] = Math.abs(colDiff) > 1 ? prevCol + Math.sign(colDiff) : prevCol;
  }
}
