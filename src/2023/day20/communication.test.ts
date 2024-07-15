import {
  BroadcastModule,
  CommunicationSystem,
  ConjunctionModule,
  FlipFlopModule,
  parseModuleConfLine,
  type Pulse,
} from './communication.js';

describe('parseModuleConfLine()', () => {
  describe('parses broadcaster module', () => {
    it('with 1 destination', () => {
      expect(parseModuleConfLine('broadcaster -> mod')).toEqual({
        type: 'broadcast',
        name: 'broadcaster',
        destinations: ['mod'],
      });
    });

    it('with multiple destinations', () => {
      expect(parseModuleConfLine('broadcaster -> mod1, mod2, mod3')).toEqual({
        type: 'broadcast',
        name: 'broadcaster',
        destinations: ['mod1', 'mod2', 'mod3'],
      });
    });
  });

  describe('parses flip-flop module', () => {
    it('with 1 destination', () => {
      expect(parseModuleConfLine('%abc -> mod')).toEqual({
        type: 'flipflop',
        name: 'abc',
        destinations: ['mod'],
      });
    });

    it('with multiple destinations', () => {
      expect(parseModuleConfLine('%abc -> mod1, mod2, mod3')).toEqual({
        type: 'flipflop',
        name: 'abc',
        destinations: ['mod1', 'mod2', 'mod3'],
      });
    });
  });

  describe('parses conjunction module', () => {
    it('with 1 destination', () => {
      expect(parseModuleConfLine('&abc -> mod')).toEqual({
        type: 'conjunction',
        name: 'abc',
        destinations: ['mod'],
      });
    });

    it('with multiple destinations', () => {
      expect(parseModuleConfLine('&abc -> mod1, mod2, mod3')).toEqual({
        type: 'conjunction',
        name: 'abc',
        destinations: ['mod1', 'mod2', 'mod3'],
      });
    });
  });
});

describe('BroadcastModule', () => {
  describe('processPulse()', () => {
    it.each<Pulse>(['low', 'high'])('sends same pulse: %s', (pulse) => {
      const module = new BroadcastModule(['d1', 'd2']);
      expect(module.processPulse(pulse)).toEqual({ pulse, destinations: ['d1', 'd2'] });
    });
  });
});

describe('FlipFlopModule', () => {
  describe('constructor', () => {
    it('sets initial state to off', () => {
      const module = new FlipFlopModule('module', ['dest']);
      expect(module.state).toBe('off');
    });
  });

  describe('processPulse()', () => {
    let module: FlipFlopModule;
    const setStateOn = () => module.processPulse('low');
    beforeEach(() => {
      module = new FlipFlopModule('module', ['d1', 'd2']);
    });

    describe('given low pulse', () => {
      const act = () => module.processPulse('low');

      describe('given state off', () => {
        it('flips to on', () => {
          act();
          expect(module.state).toBe('on');
        });

        it('sends high pulse', () => {
          const result = act();
          expect(result).toEqual({ pulse: 'high', destinations: ['d1', 'd2'] });
        });
      });

      describe('given state on', () => {
        it('flips to off', () => {
          setStateOn();
          act();
          expect(module.state).toBe('off');
        });

        it('send low pulse', () => {
          setStateOn();
          const result = act();
          expect(result).toEqual({ pulse: 'low', destinations: ['d1', 'd2'] });
        });
      });
    });

    describe('given high pulse', () => {
      const act = () => module.processPulse('high');

      describe('given state off', () => {
        it('keeps state unchanged', () => {
          act();
          expect(module.state).toBe('off');
        });

        it('doesnt send  pulse', () => {
          const result = act();
          expect(result).toBeNull();
        });
      });

      describe('given state on', () => {
        it('keeps state unchanged', () => {
          setStateOn();
          act();
          expect(module.state).toBe('on');
        });

        it('doesnt send  pulse', () => {
          setStateOn();
          const result = act();
          expect(result).toBeNull();
        });
      });
    });
  });
});

describe('ConjunctionModule', () => {
  describe('constructor', () => {
    it('sets initial inputs memorized pulse to low', () => {
      const module = new ConjunctionModule('module', ['dest'], ['i1', 'i2']);
      expect(module.inputsPrevPulse).toEqual({ i1: 'low', i2: 'low' });
    });
  });

  describe('processPulse()', () => {
    let module: ConjunctionModule;
    const setInputsPrevPulseHigh = (inputs: string[]) => {
      for (const name of inputs) {
        module.processPulse('high', name);
      }
    };
    beforeEach(() => {
      module = new ConjunctionModule('module', ['d1', 'd2'], ['i1', 'i2', 'i3']);
    });

    it('remembers received pulse', () => {
      module.processPulse('high', 'i3');
      expect(module.inputsPrevPulse).toEqual({ i1: 'low', i2: 'low', i3: 'high' });
    });

    it('sends low pulse given current input pulse and other memorized pulses high', () => {
      setInputsPrevPulseHigh(['i2', 'i3']);
      const result = module.processPulse('high', 'i1');
      expect(result).toEqual({ pulse: 'low', destinations: ['d1', 'd2'] });
    });

    it('sends high pulse given current input pulse low and other memorized pulses high', () => {
      setInputsPrevPulseHigh(['i1', 'i2', 'i3']);
      const result = module.processPulse('low', 'i1');
      expect(result).toEqual({ pulse: 'high', destinations: ['d1', 'd2'] });
    });

    it('sends high pulse given at leat one other memorized pulse low', () => {
      setInputsPrevPulseHigh(['i2']);
      const result = module.processPulse('high', 'i1');
      expect(result).toEqual({ pulse: 'high', destinations: ['d1', 'd2'] });
    });
  });
});

describe('CommunicationSystem', () => {
  const createExample1 = () =>
    new CommunicationSystem([
      'broadcaster -> a, b, c',
      '%a -> b',
      '%b -> c',
      '%c -> inv',
      '&inv -> a',
    ]);
  const createExample2 = () =>
    new CommunicationSystem([
      'broadcaster -> a',
      '%a -> inv, con',
      '&inv -> b',
      '%b -> con',
      '&con -> output',
    ]);

  describe('constructor', () => {
    it('initializes module configuration: example 1', () => {
      const system = createExample1();
      expect(system.modules).toEqual({
        broadcaster: new BroadcastModule(['a', 'b', 'c']),
        a: new FlipFlopModule('a', ['b']),
        b: new FlipFlopModule('b', ['c']),
        c: new FlipFlopModule('c', ['inv']),
        inv: new ConjunctionModule('inv', ['a'], ['c']),
      });
    });

    it('initializes module configuration: example 2', () => {
      const system = createExample2();
      expect(system.modules).toEqual({
        broadcaster: new BroadcastModule(['a']),
        a: new FlipFlopModule('a', ['inv', 'con']),
        inv: new ConjunctionModule('inv', ['b'], ['a']),
        b: new FlipFlopModule('b', ['con']),
        con: new ConjunctionModule('con', ['output'], ['a', 'b']),
      });
    });

    it.each([
      ['example 1', createExample1()],
      ['example 2', createExample2()],
    ])('initializes total pulses sent: %s', (_, system) => {
      expect(system.totalPulses).toEqual({ low: 0, high: 0 });
    });

    it.each([
      ['example 1', createExample1()],
      ['example 2', createExample2()],
    ])('initializes button pulses sent: %s', (_, system) => {
      expect(system.buttonPulses).toBe(0);
    });

    it('initializes module pulses sent: example 1', () => {
      const system = createExample1();
      expect(system.modulePulses).toEqual({
        broadcaster: { low: 0, high: 0 },
        a: { low: 0, high: 0 },
        b: { low: 0, high: 0 },
        c: { low: 0, high: 0 },
        inv: { low: 0, high: 0 },
      });
    });

    it('initializes module pulses sent: example 2', () => {
      const system = createExample2();
      expect(system.modulePulses).toEqual({
        broadcaster: { low: 0, high: 0 },
        a: { low: 0, high: 0 },
        inv: { low: 0, high: 0 },
        b: { low: 0, high: 0 },
        con: { low: 0, high: 0 },
      });
    });
  });

  describe('pushButton()', () => {
    describe('handles example 1', () => {
      let system: CommunicationSystem;
      beforeEach(() => {
        system = createExample1();
      });

      it('updates total pulses sent', () => {
        system.pushButton();
        expect(system.totalPulses).toEqual({ low: 8, high: 4 });
      });

      it('updates button pulses sent', () => {
        system.pushButton();
        expect(system.buttonPulses).toBe(1);
      });

      it('updates module pulses sent', () => {
        system.pushButton();
        expect(system.modulePulses).toEqual({
          broadcaster: { low: 3, high: 0 },
          a: { low: 1, high: 1 },
          b: { low: 1, high: 1 },
          c: { low: 1, high: 1 },
          inv: { low: 1, high: 1 },
        });
      });
    });

    describe('handles example 2', () => {
      let system: CommunicationSystem;
      beforeEach(() => {
        system = createExample2();
      });

      it('updates total pulses sent', () => {
        system.pushButton();
        expect(system.totalPulses).toEqual({ low: 4, high: 4 });
      });

      it('updates button pulses sent', () => {
        system.pushButton();
        expect(system.buttonPulses).toBe(1);
      });

      it('updates module pulses sent', () => {
        system.pushButton();
        expect(system.modulePulses).toEqual({
          broadcaster: { low: 1, high: 0 },
          a: { low: 0, high: 2 },
          inv: { low: 1, high: 0 },
          b: { low: 0, high: 1 },
          con: { low: 1, high: 1 },
        });
      });
    });
  });
});
