import { handleInputLines } from '#utils/index.js';
import { DialerRotation } from './dialer-rotation.js';
import { Dialer } from './dialer.js';

export async function solvePart1(filepath: string) {
  const dialer = Dialer.create(50);
  await handleInputLines(filepath, (line) => {
    dialer.rotate(DialerRotation.parse(line));
  });
  return dialer.zeroEndCount();
}

export async function solvePart2(filepath: string) {
  const dialer = Dialer.create(50);
  await handleInputLines(filepath, (line) => {
    dialer.rotate(DialerRotation.parse(line));
  });
  return dialer.zeroCrossCount();
}
