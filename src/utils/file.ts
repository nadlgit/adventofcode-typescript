import { createReadStream, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

export function getInputLines(filepath: string) {
  return readFileSync(filepath).toString().replaceAll('\r', '').split('\n');
}

export async function parseInputLines<T>(
  filepath: string,
  parseLine: (line: string) => T
): Promise<T[]> {
  const output: T[] = [];
  const rl = createInterface({ input: createReadStream(filepath) });
  for await (const line of rl) {
    output.push(parseLine(line));
  }
  return output;
}
