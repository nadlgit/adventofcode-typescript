import { createReadStream, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

export function getInputLines(filepath: string) {
  return readFileSync(filepath).toString().replaceAll('\r', '').split('\n');
}

export function getInputReadlineInterface(filepath: string) {
  return createInterface({ input: createReadStream(filepath) });
}
