import { isEqualObject } from '#utils/index.js';

type PacketDataList = (number | PacketDataList)[];

export function parsePacketPairs(lines: string[]): [PacketDataList, PacketDataList][] {
  const pairs: [PacketDataList, PacketDataList][] = [];
  let firstPacket: PacketDataList | undefined;
  for (const line of lines) {
    if (line.length > 0) {
      if (firstPacket === undefined) {
        firstPacket = JSON.parse(line) as PacketDataList;
      } else {
        pairs.push([firstPacket, JSON.parse(line) as PacketDataList]);
        firstPacket = undefined;
      }
    }
  }
  return pairs;
}

export function comparePacketValuesOrder(
  left: number | PacketDataList,
  right: number | PacketDataList
): 'pass' | 'fail' | 'continue' {
  if (Number.isInteger(left) && Number.isInteger(right) && left !== right) {
    return left < right ? 'pass' : 'fail';
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length && i < right.length; i++) {
      const test = comparePacketValuesOrder(left[i], right[i]);
      if (test !== 'continue') {
        return test;
      }
    }
    if (left.length !== right.length) {
      return left.length < right.length ? 'pass' : 'fail';
    }
  }

  if (Number.isInteger(left) && Array.isArray(right)) {
    return comparePacketValuesOrder([left], right);
  }

  if (Array.isArray(left) && Number.isInteger(right)) {
    return comparePacketValuesOrder(left, [right]);
  }

  return 'continue';
}

export function findRightOrderedPairs(pairs: [PacketDataList, PacketDataList][]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < pairs.length; i++) {
    const [packet1, packet2] = pairs[i];
    if (comparePacketValuesOrder(packet1, packet2) === 'pass') {
      indices.push(i + 1);
    }
  }
  return indices;
}

export function sortPackets(packets: PacketDataList[]): PacketDataList[] {
  return [...packets].sort(
    (a, b) => ({ pass: -1, fail: 1, continue: 0 }[comparePacketValuesOrder(a, b)])
  );
}

export function findDecoderKey(packets: PacketDataList[]): number {
  const divider1 = [[2]];
  const divider2 = [[6]];
  const sortedSignal = sortPackets([divider1, divider2, ...packets]);
  const index1 = 1 + sortedSignal.findIndex((packet) => isEqualObject(packet, divider1));
  const index2 = 1 + sortedSignal.findIndex((packet) => isEqualObject(packet, divider2));
  return index1 * index2;
}
