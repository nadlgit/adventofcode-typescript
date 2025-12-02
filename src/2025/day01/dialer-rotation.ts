export class DialerRotation {
  private constructor(
    private readonly _direction: 'left' | 'right',
    private readonly _distance: number
  ) {
    if (!Number.isInteger(_distance)) {
      throw new DialerRotationError('DialerRotation distance must be an integer');
    }
    if (_distance < 0) {
      throw new DialerRotationError('DialerRotation distance must be positive');
    }
  }

  static of(direction: 'left' | 'right', distance: number) {
    return new DialerRotation(direction, distance);
  }

  static parse(input: string) {
    const direction = input[0];
    const distance = Number.parseInt(input.slice(1));
    switch (direction) {
      case 'L':
        return new DialerRotation('left', distance);
      case 'R':
        return new DialerRotation('right', distance);
      default:
        throw new DialerRotationError(`Direction ${direction} is not supported`);
    }
  }

  get direction() {
    return this._direction;
  }

  get distance() {
    return this._distance;
  }
}

class DialerRotationError extends Error {}
