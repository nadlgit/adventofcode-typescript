import { createReadStream, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

export function getInputLines(filepath: string) {
  return readFileSync(filepath).toString().replaceAll('\r', '').split('\n');
}

export async function handleInputLines<T>(
  filepath: string,
  handleLine: (line: string) => T
): Promise<T[]> {
  const output: T[] = [];
  const rl = createInterface({ input: createReadStream(filepath) });
  for await (const line of rl) {
    output.push(handleLine(line));
  }
  return output;
}
