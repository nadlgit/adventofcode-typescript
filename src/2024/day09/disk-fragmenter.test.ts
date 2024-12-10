import { Disk } from './disk-fragmenter.js';

describe('Disk.parseMap()', () => {
  it('handle example', () => {
    const disk = Disk.parseMap('2333133121414131402');
    expect(disk).toEqual(
      new Disk(42, {
        0: [[0, 1]],
        1: [[5, 7]],
        2: [[11, 11]],
        3: [[15, 17]],
        4: [[19, 20]],
        5: [[22, 25]],
        6: [[27, 30]],
        7: [[32, 34]],
        8: [[36, 39]],
        9: [[40, 41]],
      })
    );
  });
});

describe('Disk.fsChecksum()', () => {
  it('handle example compacted block mode', () => {
    const disk = new Disk(42, {
      0: [[0, 1]],
      1: [[5, 7]],
      2: [[11, 11]],
      3: [[15, 17]],
      4: [[19, 20]],
      5: [[22, 25]],
      6: [
        [18, 18],
        [21, 21],
        [26, 27],
      ],
      7: [[12, 14]],
      8: [
        [4, 4],
        [8, 10],
      ],
      9: [[2, 3]],
    });
    expect(disk.fsChecksum()).toEqual(1928);
  });
});

describe('Disk.compact() block mode', () => {
  const expectBlockMoved = (
    length: number,
    initialFiles: Record<number, [number, number][]>,
    expectedFiles: Record<number, [number, number][]>
  ) => {
    const disk = new Disk(length, initialFiles);
    disk.compact('block');
    expect(disk).toEqual(new Disk(length, expectedFiles));
  };

  const expectUnchanged = (length: number, files: Record<number, [number, number][]>) => {
    const disk = new Disk(length, files);
    disk.compact('block');
    expect(disk).toEqual(new Disk(length, files));
  };

  describe('keep block positions', () => {
    it('given no file', () => {
      expectUnchanged(5, {});
    });

    it('given no free space', () => {
      expectUnchanged(5, {
        0: [[0, 0]],
        1: [[1, 4]],
      });
    });

    it('given already compacted', () => {
      expectUnchanged(5, {
        0: [[0, 0]],
        1: [[1, 2]],
      });
    });
  });

  it('move file blocks to leftmost free space block', () => {
    expectBlockMoved(
      7,
      {
        0: [[0, 0]],
        1: [[2, 2]],
        2: [[5, 6]],
      },
      {
        0: [[0, 0]],
        1: [[2, 2]],
        2: [
          [1, 1],
          [3, 3],
        ],
      }
    );
  });

  it('handle disk map 12345', () => {
    expectBlockMoved(
      15,
      {
        0: [[0, 0]],
        1: [[3, 5]],
        2: [[10, 14]],
      },
      {
        0: [[0, 0]],
        1: [[3, 5]],
        2: [
          [1, 2],
          [6, 8],
        ],
      }
    );
  });

  it('handle example', () => {
    expectBlockMoved(
      42,
      {
        0: [[0, 1]],
        1: [[5, 7]],
        2: [[11, 11]],
        3: [[15, 17]],
        4: [[19, 20]],
        5: [[22, 25]],
        6: [[27, 30]],
        7: [[32, 34]],
        8: [[36, 39]],
        9: [[40, 41]],
      },
      {
        0: [[0, 1]],
        1: [[5, 7]],
        2: [[11, 11]],
        3: [[15, 17]],
        4: [[19, 20]],
        5: [[22, 25]],
        6: [
          [18, 18],
          [21, 21],
          [26, 27],
        ],
        7: [[12, 14]],
        8: [
          [4, 4],
          [8, 10],
        ],
        9: [[2, 3]],
      }
    );
  });
});

describe('Disk.compact() file mode', () => {
  const expectBlockMoved = (
    length: number,
    initialFiles: Record<number, [number, number][]>,
    expectedFiles: Record<number, [number, number][]>
  ) => {
    const disk = new Disk(length, initialFiles);
    disk.compact('file');
    expect(disk).toEqual(new Disk(length, expectedFiles));
  };

  const expectUnchanged = (length: number, files: Record<number, [number, number][]>) => {
    const disk = new Disk(length, files);
    disk.compact('file');
    expect(disk).toEqual(new Disk(length, files));
  };

  describe('keep block positions', () => {
    it('given no file', () => {
      expectUnchanged(5, {});
    });

    it('given no free space', () => {
      expectUnchanged(5, {
        0: [[0, 0]],
        1: [[1, 4]],
      });
    });

    it('given already compacted', () => {
      expectUnchanged(5, {
        0: [[0, 0]],
        1: [[1, 2]],
      });
    });
  });

  it('move entire file to leftmost contiguous free space', () => {
    expectBlockMoved(
      7,
      {
        0: [[0, 0]],
        1: [[2, 2]],
        2: [[5, 6]],
      },
      {
        0: [[0, 0]],
        1: [[1, 1]],
        2: [[3, 4]],
      }
    );
  });

  it('handle example', () => {
    expectBlockMoved(
      42,
      {
        0: [[0, 1]],
        1: [[5, 7]],
        2: [[11, 11]],
        3: [[15, 17]],
        4: [[19, 20]],
        5: [[22, 25]],
        6: [[27, 30]],
        7: [[32, 34]],
        8: [[36, 39]],
        9: [[40, 41]],
      },
      {
        0: [[0, 1]],
        1: [[5, 7]],
        2: [[4, 4]],
        3: [[15, 17]],
        4: [[12, 13]],
        5: [[22, 25]],
        6: [[27, 30]],
        7: [[8, 10]],
        8: [[36, 39]],
        9: [[2, 3]],
      }
    );
  });
});
