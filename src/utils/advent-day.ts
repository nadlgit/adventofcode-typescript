type AdventDayPart<T> = {
  solve: (filepath: string) => T | Promise<T>;
  examples: { filename: string; expected: T }[];
};

export type AdventDay<T1 = number, T2 = T1> = {
  part1: AdventDayPart<T1>;
  part2?: AdventDayPart<T2>;
};
