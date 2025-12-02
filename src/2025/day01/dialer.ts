import type { DialerRotation } from './dialer-rotation.js';

export class Dialer {
  private static readonly MIN_VALUE = 0;
  private static readonly MAX_VALUE = 99;
  private static readonly INTERVAL_SIZE = Dialer.MAX_VALUE - Dialer.MIN_VALUE + 1;
  private _zeroEndCount = 0;
  private _zeroCrossCount = 0;

  private constructor(private _currentPosition: number) {
    if (!Number.isInteger(_currentPosition)) {
      throw new DialerError('Dialer position must be an integer');
    }
    if (_currentPosition < Dialer.MIN_VALUE || _currentPosition > Dialer.MAX_VALUE) {
      throw new DialerError(
        `Dialer position must be between ${Dialer.MIN_VALUE.toString()} and ${Dialer.MAX_VALUE.toString()}`
      );
    }
  }

  static create(startPosition: number) {
    return new Dialer(startPosition);
  }

  currentPosition() {
    return this._currentPosition;
  }

  zeroEndCount() {
    return this._zeroEndCount;
  }

  zeroCrossCount() {
    return this._zeroCrossCount;
  }

  rotate(rotation: DialerRotation) {
    const INITIAL_POSITION = this._currentPosition;
    const EFFECTIVE_DISTANCE = rotation.distance % Dialer.INTERVAL_SIZE;
    const FINAL_POSITION = this.computeFinalPosition({
      from: INITIAL_POSITION,
      effectiveDistance: EFFECTIVE_DISTANCE,
      direction: rotation.direction,
    });

    const IS_ENDING_AT_ZERO = this.isZero(FINAL_POSITION);
    const IS_CROSSING_ZERO =
      !this.isZero(INITIAL_POSITION) &&
      EFFECTIVE_DISTANCE >=
        this.distanceToZero({ from: INITIAL_POSITION, direction: rotation.direction });
    const FULL_ROTATION_COUNT = Math.floor(rotation.distance / Dialer.INTERVAL_SIZE);

    this._currentPosition = FINAL_POSITION;
    this._zeroEndCount += IS_ENDING_AT_ZERO ? 1 : 0;
    this._zeroCrossCount += (IS_CROSSING_ZERO ? 1 : 0) + FULL_ROTATION_COUNT;
  }

  private computeFinalPosition({
    from,
    effectiveDistance,
    direction,
  }: {
    from: number;
    effectiveDistance: number;
    direction: DialerRotation['direction'];
  }) {
    switch (direction) {
      case 'left':
        return effectiveDistance <= from - Dialer.MIN_VALUE
          ? from - effectiveDistance
          : from - effectiveDistance + Dialer.INTERVAL_SIZE;
      case 'right':
        return effectiveDistance <= Dialer.MAX_VALUE - from
          ? from + effectiveDistance
          : from + effectiveDistance - Dialer.INTERVAL_SIZE;
    }
  }

  private isZero(position: number) {
    return position === 0;
  }

  private distanceToZero({
    from,
    direction,
  }: {
    from: number;
    direction: DialerRotation['direction'];
  }) {
    switch (direction) {
      case 'left':
        return from;
      case 'right':
        return Dialer.MAX_VALUE + 1 - from;
    }
  }
}

class DialerError extends Error {}
