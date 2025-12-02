import { DialerRotation } from './dialer-rotation.js';
import { Dialer } from './dialer.js';

it.each([
  [1, 82, 0, 1],
  [2, 52, 0, 1],
  [3, 0, 1, 2],
  [4, 95, 1, 2],
  [5, 55, 1, 3],
  [6, 0, 2, 4],
  [7, 99, 2, 4],
  [8, 0, 3, 5],
  [9, 14, 3, 5],
  [10, 32, 3, 6],
])('handle example step %d', (step, position, zeroEndCount, zeroCrossCount) => {
  const dialer = Dialer.create(50);
  const example = ['L68', 'L30', 'R48', 'L5', 'R60', 'L55', 'L1', 'L99', 'R14', 'L82'] as const;
  const rotations = example.slice(0, step).map((line) => DialerRotation.parse(line));
  for (const rotation of rotations) {
    dialer.rotate(rotation);
  }
  expect.soft(dialer.currentPosition()).toBe(position);
  expect.soft(dialer.zeroEndCount()).toBe(zeroEndCount);
  expect.soft(dialer.zeroCrossCount()).toBe(zeroCrossCount);
});

it('handle rotation multiple times', () => {
  const dialer = Dialer.create(50);
  dialer.rotate(DialerRotation.parse('R1000'));
  expect.soft(dialer.currentPosition()).toBe(50);
  expect.soft(dialer.zeroEndCount()).toBe(0);
  expect.soft(dialer.zeroCrossCount()).toBe(10);
});
