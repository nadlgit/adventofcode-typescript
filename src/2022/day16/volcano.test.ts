import { createValveGraph, findPathReleasingMostPressure, parseValveNetwork } from './volcano.js';

describe('parseValveNetwork()', () => {
  it('parse example', () => {
    const lines = [
      'Valve AA has flow rate=0; tunnels lead to valves DD, II, BB',
      'Valve BB has flow rate=13; tunnels lead to valves CC, AA',
      'Valve CC has flow rate=2; tunnels lead to valves DD, BB',
      'Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE',
      'Valve EE has flow rate=3; tunnels lead to valves FF, DD',
      'Valve FF has flow rate=0; tunnels lead to valves EE, GG',
      'Valve GG has flow rate=0; tunnels lead to valves FF, HH',
      'Valve HH has flow rate=22; tunnel leads to valve GG',
      'Valve II has flow rate=0; tunnels lead to valves AA, JJ',
      'Valve JJ has flow rate=21; tunnel leads to valve II',
    ];
    expect(parseValveNetwork(lines)).toEqual({
      AA: { flowRate: 0, connectedValves: ['DD', 'II', 'BB'] },
      BB: { flowRate: 13, connectedValves: ['CC', 'AA'] },
      CC: { flowRate: 2, connectedValves: ['DD', 'BB'] },
      DD: { flowRate: 20, connectedValves: ['CC', 'AA', 'EE'] },
      EE: { flowRate: 3, connectedValves: ['FF', 'DD'] },
      FF: { flowRate: 0, connectedValves: ['EE', 'GG'] },
      GG: { flowRate: 0, connectedValves: ['FF', 'HH'] },
      HH: { flowRate: 22, connectedValves: ['GG'] },
      II: { flowRate: 0, connectedValves: ['AA', 'JJ'] },
      JJ: { flowRate: 21, connectedValves: ['II'] },
    });
  });

  it('ignore empty lines', () => {
    const lines = [
      '',
      'Valve AA has flow rate=0; tunnels lead to valves DD, II, BB',
      '',
      'Valve JJ has flow rate=21; tunnel leads to valve II',
      '',
    ];
    expect(parseValveNetwork(lines)).toEqual({
      AA: { flowRate: 0, connectedValves: ['DD', 'II', 'BB'] },
      JJ: { flowRate: 21, connectedValves: ['II'] },
    });
  });
});

describe('createValveGraph()', () => {
  it('handle 2-valve network with no damage', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 1, distanceToOpenableValves: { BB: 1 } },
      BB: { flowRate: 1, distanceToOpenableValves: { AA: 1 } },
    });
  });

  it('handle 2-valve network with start valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 0, distanceToOpenableValves: { BB: 1 } },
      BB: { flowRate: 1, distanceToOpenableValves: {} },
    });
  });

  it('handle 2-valve network with end valve damaged', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 0, connectedValves: ['AA'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 1, distanceToOpenableValves: {} },
    });
  });

  it('handle straight line network with no damage', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 0, connectedValves: ['AA', 'CC'] },
      CC: { flowRate: 0, connectedValves: ['BB', 'DD'] },
      DD: { flowRate: 1, connectedValves: ['CC'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 1, distanceToOpenableValves: { DD: 3 } },
      DD: { flowRate: 1, distanceToOpenableValves: { AA: 3 } },
    });
  });

  it('handle cycle network with start valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB', 'CC'] },
      BB: { flowRate: 1, connectedValves: ['AA', 'CC'] },
      CC: { flowRate: 1, connectedValves: ['AA', 'BB'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 0, distanceToOpenableValves: { BB: 1, CC: 1 } },
      BB: { flowRate: 1, distanceToOpenableValves: { CC: 1 } },
      CC: { flowRate: 1, distanceToOpenableValves: { BB: 1 } },
    });
  });

  it('handle angle line network with no damage', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB', 'CC'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
      CC: { flowRate: 1, connectedValves: ['AA', 'DD'] },
      DD: { flowRate: 1, connectedValves: ['CC'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: { flowRate: 1, distanceToOpenableValves: { BB: 1, CC: 1, DD: 2 } },
      BB: { flowRate: 1, distanceToOpenableValves: { AA: 1, CC: 2, DD: 3 } },
      CC: { flowRate: 1, distanceToOpenableValves: { AA: 1, BB: 2, DD: 1 } },
      DD: { flowRate: 1, distanceToOpenableValves: { AA: 2, BB: 3, CC: 1 } },
    });
  });

  it('handle example', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['DD', 'II', 'BB'] },
      BB: { flowRate: 13, connectedValves: ['CC', 'AA'] },
      CC: { flowRate: 2, connectedValves: ['DD', 'BB'] },
      DD: { flowRate: 20, connectedValves: ['CC', 'AA', 'EE'] },
      EE: { flowRate: 3, connectedValves: ['FF', 'DD'] },
      FF: { flowRate: 0, connectedValves: ['EE', 'GG'] },
      GG: { flowRate: 0, connectedValves: ['FF', 'HH'] },
      HH: { flowRate: 22, connectedValves: ['GG'] },
      II: { flowRate: 0, connectedValves: ['AA', 'JJ'] },
      JJ: { flowRate: 21, connectedValves: ['II'] },
    };
    expect(createValveGraph(network)).toEqual({
      AA: {
        flowRate: 0,
        distanceToOpenableValves: {
          BB: 1,
          CC: 2,
          DD: 1,
          EE: 2,
          HH: 5,
          JJ: 2,
        },
      },
      BB: {
        flowRate: 13,
        distanceToOpenableValves: {
          CC: 1,
          DD: 2,
          EE: 3,
          HH: 6,
          JJ: 3,
        },
      },
      CC: {
        flowRate: 2,
        distanceToOpenableValves: {
          BB: 1,
          DD: 1,
          EE: 2,
          HH: 5,
          JJ: 4,
        },
      },
      DD: {
        flowRate: 20,
        distanceToOpenableValves: {
          BB: 2,
          CC: 1,
          EE: 1,
          HH: 4,
          JJ: 3,
        },
      },
      EE: {
        flowRate: 3,
        distanceToOpenableValves: {
          BB: 3,
          CC: 2,
          DD: 1,
          HH: 3,
          JJ: 4,
        },
      },
      HH: {
        flowRate: 22,
        distanceToOpenableValves: {
          BB: 6,
          CC: 5,
          DD: 4,
          EE: 3,
          JJ: 7,
        },
      },
      JJ: {
        flowRate: 21,
        distanceToOpenableValves: {
          BB: 3,
          CC: 4,
          DD: 3,
          EE: 4,
          HH: 7,
        },
      },
    });
  });
});

describe('findPathReleasingMostPressure()', () => {
  it('handle 2-valve network with start valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { BB: 2 },
      pressureReleased: 28,
    });
  });

  it('handle 2-valve network with end valve damaged', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 0, connectedValves: ['AA'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { AA: 1 },
      pressureReleased: 29,
    });
  });

  it('handle 2-valve network with start flow rate > end flow rate', () => {
    const network = {
      AA: { flowRate: 10, connectedValves: ['BB'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { AA: 1, BB: 3 },
      pressureReleased: 317,
    });
  });

  it('handle 2-valve network with start flow rate < end flow rate', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 10, connectedValves: ['AA'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { AA: 4, BB: 2 },
      pressureReleased: 306,
    });
  });

  it('handle straight line network with no damage', () => {
    const network = {
      AA: { flowRate: 1, connectedValves: ['BB'] },
      BB: { flowRate: 1, connectedValves: ['AA', 'CC'] },
      CC: { flowRate: 10, connectedValves: ['BB'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { AA: 7, BB: 5, CC: 3 },
      pressureReleased: 318,
    });
  });

  it('handle cycle network with start valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB', 'CC'] },
      BB: { flowRate: 1, connectedValves: ['AA', 'CC'] },
      CC: { flowRate: 10, connectedValves: ['AA', 'BB'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { BB: 4, CC: 2 },
      pressureReleased: 306,
    });
  });

  it('handle angle line network with start valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB', 'CC'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
      CC: { flowRate: 10, connectedValves: ['AA'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { BB: 5, CC: 2 },
      pressureReleased: 305,
    });
  });

  it('handle angle line network with start valve damaged and internal valve damaged', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['BB', 'CC'] },
      BB: { flowRate: 1, connectedValves: ['AA'] },
      CC: { flowRate: 0, connectedValves: ['AA', 'DD'] },
      DD: { flowRate: 10, connectedValves: ['CC'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { BB: 7, DD: 3 },
      pressureReleased: 293,
    });
  });

  it('handle example', () => {
    const network = {
      AA: { flowRate: 0, connectedValves: ['DD', 'II', 'BB'] },
      BB: { flowRate: 13, connectedValves: ['CC', 'AA'] },
      CC: { flowRate: 2, connectedValves: ['DD', 'BB'] },
      DD: { flowRate: 20, connectedValves: ['CC', 'AA', 'EE'] },
      EE: { flowRate: 3, connectedValves: ['FF', 'DD'] },
      FF: { flowRate: 0, connectedValves: ['EE', 'GG'] },
      GG: { flowRate: 0, connectedValves: ['FF', 'HH'] },
      HH: { flowRate: 22, connectedValves: ['GG'] },
      II: { flowRate: 0, connectedValves: ['AA', 'JJ'] },
      JJ: { flowRate: 21, connectedValves: ['II'] },
    };
    expect(findPathReleasingMostPressure(network)).toEqual({
      valvesOpenedAt: { BB: 5, CC: 24, DD: 2, EE: 21, HH: 17, JJ: 9 },
      pressureReleased: 1651,
    });
  });
});
