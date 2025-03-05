type FileSystemPath = string[];

export class FileSystem {
  private constructor(
    private _directories: FileSystemPath[],
    private _files: { path: FileSystemPath; size: number }[]
  ) {}

  static fromTerminalOutput(lines: string[]): FileSystem {
    const directories: FileSystemPath[] = [['/']];
    const files: { path: FileSystemPath; size: number }[] = [];
    const currentDir: FileSystemPath = [];
    for (const line of lines.filter((line) => line.length > 0)) {
      const [part1, part2, part3] = line.split(' ');
      if (part1 === '$' && part2 === 'cd') {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        part3 === '..' ? currentDir.pop() : currentDir.push(part3);
      }
      if (part1 === 'dir') {
        directories.push([...currentDir, part2]);
      }
      if (!['$', 'dir'].includes(part1)) {
        files.push({ path: [...currentDir, part2], size: Number.parseInt(part1) });
      }
    }
    return new FileSystem(directories, files);
  }

  get directories(): string[] {
    return this._directories.map((path) => this.pathToString(path));
  }

  get files(): { path: string; size: number }[] {
    return this._files.map(({ path, size }) => ({ path: this.pathToString(path), size }));
  }

  getUsedSizeByDirectory(): { path: string; size: number }[] {
    const sizes: Record<string, number> = {};
    for (const file of this._files) {
      for (let i = 1; i < file.path.length; i++) {
        const path = this.pathToString(file.path.slice(0, i));
        sizes[path] = (sizes[path] ?? 0) + file.size;
      }
    }
    return Object.entries(sizes).map(([path, size]) => ({ path, size }));
  }

  private pathToString(path: FileSystemPath) {
    return path.join('/').replace('//', '/');
  }
}
