import { getAdjacentPositions } from '#utils/index.js';

export function parseSchematicLine(line: string) {
  const numbers: { value: number; startIdx: number; endIdx: number }[] = [];
  for (const match of line.matchAll(/\d+/g)) {
    numbers.push({
      value: Number.parseInt(match[0]),
      startIdx: match.index,
      endIdx: match.index + match[0].length - 1,
    });
  }

  const symbols: { value: string; idx: number }[] = [];
  for (const match of line.matchAll(/[^.\w]/g)) {
    symbols.push({ value: match[0], idx: match.index });
  }

  return { numbers, symbols };
}

export class EngineSchematic {
  private readonly numbersInfo: {
    value: number;
    rowIdx: number;
    startColIdx: number;
    endColIdx: number;
  }[];
  private readonly symbolsInfo: { value: string; rowIdx: number; colIdx: number }[];

  constructor(schematicLines: string[]) {
    const info = schematicLines.map((line) => parseSchematicLine(line));
    this.numbersInfo = info.flatMap(({ numbers }, rowIdx) =>
      numbers.map(({ value, startIdx, endIdx }) => ({
        value,
        rowIdx,
        startColIdx: startIdx,
        endColIdx: endIdx,
      }))
    );
    this.symbolsInfo = info.flatMap(({ symbols }, rowIdx) =>
      symbols.map(({ value, idx }) => ({ value, rowIdx, colIdx: idx }))
    );
  }

  getPartNumbers(): number[] {
    return this.numbersInfo
      .filter((num) => this.symbolsInfo.some((symbol) => this.isAdjacent(num, symbol)))
      .map(({ value }) => value);
  }

  getGearRatios(): number[] {
    return this.symbolsInfo
      .filter(({ value }) => value === '*')
      .map((symbol) =>
        this.numbersInfo.filter((num) => this.isAdjacent(num, symbol)).map(({ value }) => value)
      )
      .filter((arr) => arr.length === 2)
      .map((arr) => arr[0] * arr[1]);
  }

  private isAdjacent(
    num: (typeof this.numbersInfo)[number],
    symbol: (typeof this.symbolsInfo)[number]
  ) {
    return getAdjacentPositions({ row: symbol.rowIdx, col: symbol.colIdx }).some(
      ({ row, col }) => row === num.rowIdx && col >= num.startColIdx && col <= num.endColIdx
    );
  }
}
