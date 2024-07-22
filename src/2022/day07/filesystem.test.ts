import { FileSystem } from './filesystem.js';

describe('FileSystem', () => {
  const exampleLines = [
    '$ cd /',
    '$ ls',
    'dir a',
    '14848514 b.txt',
    '8504156 c.dat',
    'dir d',
    '$ cd a',
    '$ ls',
    'dir e',
    '29116 f',
    '2557 g',
    '62596 h.lst',
    '$ cd e',
    '$ ls',
    '584 i',
    '$ cd ..',
    '$ cd ..',
    '$ cd d',
    '$ ls',
    '4060174 j',
    '8033020 d.log',
    '5626152 d.ext',
    '7214296 k',
  ];

  describe('fromTerminalOutput()', () => {
    it('parses empty root directory', () => {
      const lines = ['$ cd /', '$ ls'];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.directories).toEqual(['/']);
      expect(fs.files).toEqual([]);
    });

    it('parses root directory with 1 file', () => {
      const lines = ['$ cd /', '$ ls', '1234 abc.txt'];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.directories).toEqual(['/']);
      expect(fs.files).toEqual([{ path: '/abc.txt', size: 1234 }]);
    });

    it('parses root directory with 1 file and 1 empty directory', () => {
      const lines = ['$ cd /', '$ ls', '1234 abc.txt', 'dir xyz'];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.directories).toIncludeSameMembers(['/', '/xyz']);
      expect(fs.files).toEqual([{ path: '/abc.txt', size: 1234 }]);
    });

    it('parses root directory with 1 directory including 1 file', () => {
      const lines = ['$ cd /', '$ ls', 'dir xyz', '$ cd xyz', '$ ls', '1234 abc.txt'];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.directories).toIncludeSameMembers(['/', '/xyz']);
      expect(fs.files).toEqual([{ path: '/xyz/abc.txt', size: 1234 }]);
    });

    it('parses root directory with 2 directories each including 1 file', () => {
      const lines = [
        '$ cd /',
        '$ ls',
        'dir xyz',
        'dir vw',
        '$ cd xyz',
        '$ ls',
        '1234 abc.txt',
        '$ cd ..',
        '$ cd vw',
        '$ ls',
        '999 def',
      ];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.directories).toIncludeSameMembers(['/', '/xyz', '/vw']);
      expect(fs.files).toIncludeSameMembers([
        { path: '/xyz/abc.txt', size: 1234 },
        { path: '/vw/def', size: 999 },
      ]);
    });

    it('handles example', () => {
      const fs = FileSystem.fromTerminalOutput(exampleLines);
      expect(fs.directories).toIncludeSameMembers(['/', '/a', '/a/e', '/d']);
      expect(fs.files).toIncludeSameMembers([
        { path: '/b.txt', size: 14848514 },
        { path: '/c.dat', size: 8504156 },
        { path: '/a/f', size: 29116 },
        { path: '/a/g', size: 2557 },
        { path: '/a/h.lst', size: 62596 },
        { path: '/a/e/i', size: 584 },
        { path: '/d/j', size: 4060174 },
        { path: '/d/d.log', size: 8033020 },
        { path: '/d/d.ext', size: 5626152 },
        { path: '/d/k', size: 7214296 },
      ]);
    });
  });

  describe('getUsedSizeByDirectory()', () => {
    it('handles root directory with 2 files', () => {
      const lines = ['$ cd /', '$ ls', '123 abc', '456 def'];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.getUsedSizeByDirectory()).toEqual([{ path: '/', size: 579 }]);
    });

    it('handles root directory with 2 directories each including 1 file', () => {
      const lines = [
        '$ cd /',
        '$ ls',
        'dir xyz',
        'dir vw',
        '$ cd xyz',
        '$ ls',
        '1234 abc.txt',
        '$ cd ..',
        '$ cd vw',
        '$ ls',
        '765 def',
      ];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.getUsedSizeByDirectory()).toIncludeSameMembers([
        { path: '/', size: 1999 },
        { path: '/xyz', size: 1234 },
        { path: '/vw', size: 765 },
      ]);
    });

    it('filters empty directories', () => {
      const lines = [
        '$ cd /',
        '$ ls',
        'dir xyz',
        'dir vw',
        '$ cd xyz',
        '$ ls',
        '$ cd ..',
        '$ cd vw',
        '$ ls',
        '999 def',
      ];
      const fs = FileSystem.fromTerminalOutput(lines);
      expect(fs.getUsedSizeByDirectory()).toIncludeSameMembers([
        { path: '/', size: 999 },
        { path: '/vw', size: 999 },
      ]);
    });

    it('handles example', () => {
      const fs = FileSystem.fromTerminalOutput(exampleLines);
      expect(fs.getUsedSizeByDirectory()).toIncludeSameMembers([
        { path: '/', size: 48381165 },
        { path: '/a', size: 94853 },
        { path: '/a/e', size: 584 },
        { path: '/d', size: 24933642 },
      ]);
    });
  });
});
