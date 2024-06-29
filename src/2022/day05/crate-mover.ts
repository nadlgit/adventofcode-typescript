type CrateStack = { id: number; content: string[] };
type MoveInstruction = { orig: number; dest: number; count: number };

export function parseCrateInstructions(lines: string[]): {
  stacks: CrateStack[];
  instructions: MoveInstruction[];
} {
  const stacks = lines
    .filter((line) => line.length > 0 && !line.startsWith('move'))
    .map((line) =>
      line.match(/.{3}\s?/g)!.map((str) => str.trim().replace('[', '').replace(']', ''))
    )
    .reverse()
    .reduce<CrateStack[]>((acc, curr, rIdx) => {
      curr.forEach((value, cIdx) => {
        if (rIdx === 0) {
          acc.push({ id: Number.parseInt(value), content: [] });
        } else if (value) {
          acc[cIdx].content.push(value);
        }
      });
      return acc;
    }, []);

  const instructions = lines
    .filter((line) => line.startsWith('move'))
    .map((line) => {
      const [count, orig, dest] = line.match(/\d+/g)!.map((n) => Number.parseInt(n));
      return { orig, dest, count };
    });

  return { stacks, instructions };
}

export function applyMoveV9000({ orig, dest, count }: MoveInstruction, stacks: CrateStack[]): void {
  const origStack = stacks.find(({ id }) => id === orig);
  const destStack = stacks.find(({ id }) => id === dest);
  if (!origStack || !destStack) return;

  for (let i = 0; i < count; i++) {
    const crate = origStack.content.pop();
    crate && destStack.content.push(crate);
  }
}

export function applyMoveV9001({ orig, dest, count }: MoveInstruction, stacks: CrateStack[]): void {
  const origStack = stacks.find(({ id }) => id === orig);
  const destStack = stacks.find(({ id }) => id === dest);
  if (!origStack || !destStack) return;

  const effectiveCount = Math.min(count, origStack.content.length);
  if (effectiveCount > 0) {
    const movedCrates = origStack.content.splice(
      origStack.content.length - effectiveCount,
      effectiveCount
    );
    destStack.content.push(...movedCrates);
  }
}

export function getStacksTopCrates(stacks: CrateStack[]): string[] {
  return [...stacks]
    .sort((a, b) => a.id - b.id)
    .map(({ content }) => (content.length > 0 ? content[content.length - 1] : ''));
}
