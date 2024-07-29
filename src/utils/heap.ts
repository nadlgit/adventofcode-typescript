type HeapNode<T, K> = { item: T; key: K };

abstract class Heap<T, K> {
  private readonly nodes: HeapNode<T, K>[] = [];

  constructor(
    private readonly heapPropertyCheck: (parent: HeapNode<T, K>, child: HeapNode<T, K>) => boolean,
    nodes: HeapNode<T, K>[] = []
  ) {
    for (const { item, key } of nodes) {
      this.insert(item, key);
    }
  }

  public get size(): number {
    return this.nodes.length;
  }

  public peek(): T | null {
    return this.nodes.length > 0 ? this.nodes[0].item : null;
  }

  public insert(item: T, key: K): void {
    this.nodes.push({ item, key });
    this.siftUp();
  }

  public extract(): T | null {
    const item = this.peek();
    if (this.nodes.length > 1) {
      this.swapNodes(0, this.nodes.length - 1);
    }
    this.nodes.pop();
    this.siftDown();
    return item;
  }

  private swapNodes(index1: number, index2: number) {
    const node1 = this.nodes[index1];
    this.nodes[index1] = this.nodes[index2];
    this.nodes[index2] = node1;
  }

  private siftUp() {
    let index = this.nodes.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heapPropertyCheck(this.nodes[parentIndex], this.nodes[index])) {
        break;
      }

      this.swapNodes(index, parentIndex);
      index = parentIndex;
    }
  }

  private siftDown() {
    let index = 0;
    while (index < Math.floor(this.nodes.length / 2)) {
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      const couldSwapLeft =
        leftIndex < this.size && !this.heapPropertyCheck(this.nodes[index], this.nodes[leftIndex]);
      const couldSwapRight =
        rightIndex < this.size &&
        !this.heapPropertyCheck(this.nodes[index], this.nodes[rightIndex]);
      if (!couldSwapLeft && !couldSwapRight) {
        break;
      }

      const childIndex =
        couldSwapRight && this.heapPropertyCheck(this.nodes[rightIndex], this.nodes[leftIndex])
          ? rightIndex
          : leftIndex;
      this.swapNodes(index, childIndex);
      index = childIndex;
    }
  }
}

export class HeapMin<T, K extends number | string = number> extends Heap<T, K> {
  constructor(nodes: HeapNode<T, K>[] = []) {
    super((parent, child) => parent.key <= child.key, nodes);
  }
}

export class HeapMax<T, K extends number | string = number> extends Heap<T, K> {
  constructor(nodes: HeapNode<T, K>[] = []) {
    super((parent, child) => parent.key >= child.key, nodes);
  }
}
