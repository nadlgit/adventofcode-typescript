export function hashString(str: string): number {
  let value = 0;
  for (const char of str) {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  }
  return value;
}

type Lens = { label: string; focal: number };

export class Box {
  private slots: Map<Lens['label'], Lens['focal']>;

  constructor(content: Lens[] = []) {
    this.slots = new Map(content.map(({ label, focal }) => [label, focal]));
  }

  getContent(): Lens[] {
    return Array.from(this.slots.entries(), ([label, focal]) => ({ label, focal }));
  }

  putLens(label: Lens['label'], focal: Lens['focal']) {
    this.slots.set(label, focal);
  }

  removeLens(label: Lens['label']) {
    this.slots.delete(label);
  }
}

export function decodeStep(
  stepStr: string
): { boxIdx: number; lensLabel: string } & (
  | { operator: '='; focalLength: number }
  | { operator: '-'; focalLength?: never }
) {
  const [lensLabel, operator, focalStr] = stepStr.split(/([-=])/);
  const boxIdx = hashString(lensLabel);
  return operator === '-'
    ? { boxIdx, lensLabel, operator }
    : { boxIdx, lensLabel, operator: '=', focalLength: Number.parseInt(focalStr) };
}

type LensConfig = Lens & { boxIdx: number; slotIdx: number };

export function performInitSequence(steps: string[]): LensConfig[] {
  const boxes = Array.from(new Array(256), () => new Box());
  for (const step of steps) {
    const { boxIdx, lensLabel, operator, focalLength } = decodeStep(step);
    if (operator === '=') {
      boxes[boxIdx].putLens(lensLabel, focalLength);
    }
    if (operator === '-') {
      boxes[boxIdx].removeLens(lensLabel);
    }
  }
  return boxes.flatMap((box, boxIdx) =>
    box.getContent().map(({ label, focal }, slotIdx) =>
      Object.fromEntries([
        ['label', label],
        ['focal', focal],
        ['boxIdx', boxIdx],
        ['slotIdx', slotIdx],
      ])
    )
  );
}

export function calcLensFocusingPower({ focal, boxIdx, slotIdx }: LensConfig): number {
  return (boxIdx + 1) * (slotIdx + 1) * focal;
}
