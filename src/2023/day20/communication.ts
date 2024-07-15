export type Pulse = 'low' | 'high';

type ModuleOutput = { pulse: Pulse; destinations: string[] };

type Module = {
  name: string;
  destinations: string[];
  processPulse: (pulse: Pulse, from: string | never) => ModuleOutput | null;
};

export function parseModuleConfLine(line: string): {
  type: 'broadcast' | 'flipflop' | 'conjunction';
  name: string;
  destinations: string[];
} {
  const [name, destinationList] = line.split(' -> ');
  const destinations = destinationList.split(', ');
  if (name === 'broadcaster') {
    return { type: 'broadcast', name, destinations };
  }
  if (name.startsWith('%')) {
    return { type: 'flipflop', name: name.substring(1), destinations };
  }
  if (name.startsWith('&')) {
    return { type: 'conjunction', name: name.substring(1), destinations };
  }
  throw new Error('Unexpected configuration line');
}

export class BroadcastModule implements Module {
  public readonly name = 'broadcaster';

  constructor(public readonly destinations: string[]) {}

  processPulse(pulse: Pulse): ModuleOutput {
    return { pulse, destinations: this.destinations };
  }
}

export class FlipFlopModule implements Module {
  private _state: 'on' | 'off' = 'off';

  constructor(public readonly name: string, public readonly destinations: string[]) {}

  get state() {
    return this._state;
  }

  processPulse(pulse: Pulse): ModuleOutput | null {
    if (pulse === 'low') {
      if (this._state === 'off') {
        this._state = 'on';
        return { pulse: 'high', destinations: this.destinations };
      } else {
        this._state = 'off';
        return { pulse: 'low', destinations: this.destinations };
      }
    } else {
      return null;
    }
  }
}

export class ConjunctionModule implements Module {
  private _inputsPrevPulse: Record<string, Pulse> = {};

  constructor(
    public readonly name: string,
    public readonly destinations: string[],
    inputs: string[]
  ) {
    for (const input of inputs) {
      this._inputsPrevPulse[input] = 'low';
    }
  }

  get inputsPrevPulse() {
    return this._inputsPrevPulse;
  }

  processPulse(pulse: Pulse, from: string): ModuleOutput {
    this._inputsPrevPulse[from] = pulse;
    return {
      pulse: Object.values(this._inputsPrevPulse).every((pulse) => pulse === 'high')
        ? 'low'
        : 'high',
      destinations: this.destinations,
    };
  }
}

export class CommunicationSystem {
  private _modules: Record<string, Module> = {};
  private _buttonPulseCount: number = 0;
  private _modulePulseCount: Record<string, Record<Pulse, number>> = {};

  constructor(confLines: string[]) {
    const modules = confLines.map((line) => parseModuleConfLine(line));
    for (const { type, name, destinations } of modules) {
      if (type === 'broadcast') {
        this._modules[name] = new BroadcastModule(destinations);
      }
      if (type === 'flipflop') {
        this._modules[name] = new FlipFlopModule(name, destinations);
      }
      if (type === 'conjunction') {
        const inputs = modules
          .filter(({ destinations: inputDest }) => inputDest.includes(name))
          .map(({ name: inputName }) => inputName);
        this._modules[name] = new ConjunctionModule(name, destinations, inputs);
      }
      this._modulePulseCount[name] = { low: 0, high: 0 };
    }
  }

  get modules(): Readonly<Record<string, Module>> {
    return this._modules;
  }

  get totalPulses(): Readonly<Record<Pulse, number>> {
    return Object.values(this._modulePulseCount).reduce(
      (acc, { low, high }) => ({ low: acc.low + low, high: acc.high + high }),
      { low: this._buttonPulseCount, high: 0 }
    );
  }

  get buttonPulses(): number {
    return this._buttonPulseCount;
  }

  get modulePulses(): Readonly<Record<string, Record<Pulse, number>>> {
    return this._modulePulseCount;
  }

  pushButton() {
    this._buttonPulseCount++;
    const pulseQueue: { pulse: Pulse; from: string; to: string }[] = [
      { pulse: 'low', from: '', to: 'broadcaster' },
    ];
    while (pulseQueue.length > 0) {
      const { pulse: currPulse, from: currFrom, to: currTo } = pulseQueue.shift()!;
      const output = this._modules[currTo].processPulse(currPulse, currFrom);
      if (output) {
        const { pulse, destinations } = output;
        this._modulePulseCount[currTo][pulse] += destinations.length;
        for (const dest of destinations) {
          if (Object.keys(this._modules).includes(dest)) {
            pulseQueue.push({ pulse, from: currTo, to: dest });
          }
        }
      }
    }
  }
}
