import { sum } from '#utils/index.js';

export class Disk {
  private readonly FREE_SPACE_ID = -1;
  private blocks: number[];
  private lengths: Record<number, number>;
  private fileCount: number;

  constructor(length: number, files: Record<number, [number, number][]>) {
    this.blocks = Array.from({ length }, () => this.FREE_SPACE_ID);
    this.lengths = { [this.FREE_SPACE_ID]: length };

    this.fileCount = Object.keys(files).length;
    const sortedFileBlockRanges = Object.entries(files)
      .flatMap(([fileId, blockRanges]) =>
        blockRanges.map(([start, end]) => ({
          rangeStart: start,
          rangeLength: end - start + 1,
          fileId: Number.parseInt(fileId),
        }))
      )
      .sort((a, b) => a.rangeStart - b.rangeStart);
    for (const { rangeStart, rangeLength, fileId } of sortedFileBlockRanges) {
      this.lengths[fileId] = (this.lengths[fileId] ?? 0) + rangeLength;
      this.lengths[this.FREE_SPACE_ID] -= rangeLength;
      for (let i = rangeStart; i < rangeStart + rangeLength; i++) {
        this.blocks[i] = fileId;
      }
    }
  }

  static parseMap(line: string): Disk {
    const digits = line.split('').map((n) => Number.parseInt(n));
    const length = sum(digits);
    const files = digits.reduce<Record<number, [number, number][]>>((acc, digit, idx) => {
      if (idx % 2 === 0 && digit > 0) {
        const fileId = idx / 2;
        const position = sum(digits.slice(0, idx));
        acc[fileId] = [[position, position + digit - 1]];
      }
      return acc;
    }, {});
    return new Disk(length, files);
  }

  fsChecksum(): number {
    const fileChecksums = this.blocks.map((block, position) =>
      block === this.FREE_SPACE_ID ? 0 : block * position
    );
    return sum(fileChecksums);
  }

  compact(mode: 'block' | 'file') {
    if ([0, this.blocks.length].includes(this.lengths[this.FREE_SPACE_ID])) {
      return;
    }

    switch (mode) {
      case 'block':
        for (let i = this.blocks.length - 1; i >= 0; i--) {
          const freeBlockPosition = this.blocks.indexOf(this.FREE_SPACE_ID);
          if (freeBlockPosition > i) {
            break;
          }
          const fileId = this.blocks[i];
          if (fileId !== this.FREE_SPACE_ID) {
            this.blocks[freeBlockPosition] = fileId;
            this.blocks[i] = this.FREE_SPACE_ID;
          }
        }
        break;

      case 'file':
        for (let fileId = this.fileCount - 1; fileId >= 0; fileId--) {
          const fileLength = this.lengths[fileId];
          const fileBlockRangeStart = this.blocks.indexOf(fileId);
          const freeBlockRangeStart = this.blocks.findIndex(
            (block, idx) =>
              block === this.FREE_SPACE_ID &&
              this.blocks.slice(idx, idx + fileLength).every((b) => b === this.FREE_SPACE_ID)
          );
          if (freeBlockRangeStart !== -1 && freeBlockRangeStart < fileBlockRangeStart) {
            for (let i = 0; i < fileLength; i++) {
              this.blocks[freeBlockRangeStart + i] = fileId;
              this.blocks[fileBlockRangeStart + i] = this.FREE_SPACE_ID;
            }
          }
        }
        break;
    }
  }
}
