type ValveNetwork = Readonly<
  Record<string, Readonly<{ flowRate: number; connectedValves: ReadonlyArray<string> }>>
>;

type ValveGraph = Readonly<
  Record<
    string,
    Readonly<{
      flowRate: number;
      distanceToOpenableValves: Readonly<Record<string, number>>;
    }>
  >
>;

const START_VALVE = 'AA';

export function parseValveNetwork(lines: string[]): ValveNetwork {
  return lines.reduce<ValveNetwork>((acc, line) => {
    if (line.length === 0) {
      return acc;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { label, rateStr, connectedStr } = line.match(
      /Valve (?<label>\w+) has flow rate=(?<rateStr>\d+); tunnels? leads? to valves? (?<connectedStr>.+)/
    )!.groups!;
    const flowRate = Number.parseInt(rateStr);
    const connectedValves = connectedStr.split(', ');
    return {
      ...acc,
      [label]: { flowRate, connectedValves },
    };
  }, {});
}

export function createValveGraph(network: ValveNetwork): ValveGraph {
  const ALL_LABELS: ReadonlyArray<string> = Object.keys(network);

  const calcValveDistance = (labelFrom: string, labelTo: string) => {
    let distance = Infinity;
    const pathQueue = network[labelFrom].connectedValves.map((nextLabel) => [labelFrom, nextLabel]);
    while (pathQueue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currPath = pathQueue.pop()!;
      const currLabel = currPath[currPath.length - 1];
      const currDistance = currPath.length - 1;
      if (currDistance >= distance || currLabel === labelTo) {
        distance = Math.min(distance, currDistance);
        continue;
      }
      const candidates = network[currLabel].connectedValves.reduce<Array<string[]>>(
        (acc, nextLabel) =>
          currPath.includes(nextLabel) ? acc : [...acc, [...currPath, nextLabel]],
        []
      );
      pathQueue.push(...candidates);
    }
    return distance;
  };

  const createGraphNode = (label: string) => ({
    flowRate: network[label].flowRate,
    distanceToOpenableValves: ALL_LABELS.reduce<Record<string, number>>(
      (acc, otherLabel) =>
        otherLabel !== label && network[otherLabel].flowRate > 0
          ? { ...acc, [otherLabel]: calcValveDistance(label, otherLabel) }
          : acc,
      {}
    ),
  });

  return ALL_LABELS.reduce<ValveGraph>(
    (acc, label) =>
      network[label].flowRate > 0 || label === START_VALVE
        ? { ...acc, [label]: createGraphNode(label) }
        : acc,
    {}
  );
}

export function findPathReleasingMostPressure(valveNetwork: ValveNetwork): {
  valvesOpenedAt: Record<string, number>;
  pressureReleased: number;
} {
  const graph = createValveGraph(valveNetwork);
  const DURATION = 30;

  const queue = [
    {
      minutesElapsed: 0,
      openedValvesWithTime: [] as Array<[string, number]>,
      remainingValves: Object.keys(graph).filter((label) => graph[label].flowRate > 0),
      position: START_VALVE,
    },
  ];
  if (graph[START_VALVE].flowRate > 0) {
    queue.push({
      minutesElapsed: 1,
      openedValvesWithTime: [[START_VALVE, 1]],
      remainingValves: Object.keys(graph).filter(
        (label) => graph[label].flowRate > 0 && label !== START_VALVE
      ),
      position: START_VALVE,
    });
  }
  let valvesOpenedAt: Record<string, number> = {};
  let pressureReleased = 0;
  while (queue.length > 0) {
    const {
      minutesElapsed: currMinutesElapsed,
      openedValvesWithTime: currOpenedValvesWithTime,
      remainingValves: currRemainingValves,
      position: currPosition,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = queue.pop()!;

    if (currMinutesElapsed >= DURATION || currRemainingValves.length === 0) {
      const pathPressureReleased = currOpenedValvesWithTime.reduce(
        (acc, [label, openedAt]) => acc + graph[label].flowRate * Math.max(0, DURATION - openedAt),
        0
      );
      if (pathPressureReleased > pressureReleased) {
        pressureReleased = pathPressureReleased;
        valvesOpenedAt = Object.fromEntries(currOpenedValvesWithTime);
      }
      continue;
    }

    const nextQueueItems = Object.entries(graph[currPosition].distanceToOpenableValves).reduce<
      typeof queue
    >((acc, [nextLabel, distance]) => {
      const minutesElapsed = currMinutesElapsed + distance + 1;
      if (minutesElapsed < DURATION && currRemainingValves.includes(nextLabel)) {
        const minutesElapsed = currMinutesElapsed + distance + 1;
        acc.push({
          minutesElapsed,
          openedValvesWithTime: [...currOpenedValvesWithTime, [nextLabel, minutesElapsed]],
          remainingValves: currRemainingValves.filter((label) => label !== nextLabel),
          position: nextLabel,
        });
      }
      return acc;
    }, []);
    if (nextQueueItems.length > 0) {
      queue.push(...nextQueueItems);
    } else {
      queue.push({
        minutesElapsed: DURATION,
        openedValvesWithTime: currOpenedValvesWithTime,
        remainingValves: currRemainingValves,
        position: currPosition,
      });
    }
  }

  return { valvesOpenedAt, pressureReleased };
}
