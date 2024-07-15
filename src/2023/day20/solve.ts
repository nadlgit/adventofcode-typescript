import { getInputLines, leastCommonMultiple } from '#utils/index.js';
import { CommunicationSystem } from './communication.js';

export function solvePart1(filepath: string) {
  const system = new CommunicationSystem(getInputLines(filepath));
  for (let i = 0; i < 1000; i++) {
    system.pushButton();
  }
  const { low, high } = system.totalPulses;
  return low * high;
}

export function solvePart2(filepath: string) {
  // In my personal input rx predecessors are: rx <- dt <- dl, ks, pm, vk
  // dt, dl, ks, pm, vk are all conjonctions modules
  // dl, ks, pm, vk each have only 1 conjonction module as predecessor: ts, vr, pf, xd
  // So we need to output a low pulse from ts, vr, pf, xd at same time

  const system = new CommunicationSystem(getInputLines(filepath));
  const trackedModules = ['ts', 'vr', 'pf', 'xd'];
  const minButtonPulses: Record<string, number> = {};
  while (Object.keys(minButtonPulses).length !== trackedModules.length) {
    system.pushButton();
    for (const mod of trackedModules) {
      if (!minButtonPulses[mod] && system.modulePulses[mod].low > 0) {
        minButtonPulses[mod] = system.buttonPulses;
      }
    }
  }
  return leastCommonMultiple(Object.values(minButtonPulses));
}
