export class ChiefNotes {
  constructor(
    private readonly list1: ReadonlyArray<number>,
    private readonly list2: ReadonlyArray<number>
  ) {}

  static parseLists(lines: string[]): ChiefNotes {
    const list1: number[] = [];
    const list2: number[] = [];
    for (const line of lines.filter((line) => line.length > 0)) {
      const [a, b] = line.split('  ');
      list1.push(Number.parseInt(a));
      list2.push(Number.parseInt(b));
    }
    return new ChiefNotes(list1, list2);
  }

  calcDistance(): number[] {
    const sorted1 = [...this.list1].sort();
    const sorted2 = [...this.list2].sort();
    return sorted1.map((n, i) => Math.abs(n - sorted2[i]));
  }

  calcSimilarityScore(): number[] {
    return this.list1.map((n) => n * this.list2.filter((m) => m === n).length);
  }
}
