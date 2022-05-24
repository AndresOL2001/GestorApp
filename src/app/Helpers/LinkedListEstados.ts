export class NodeLink {
  public value: unknown;
  public next: NodeLink | null;

  constructor(value: unknown) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  public head: NodeLink;
  public tail: NodeLink;
  public length: number;

  constructor(value?: unknown) {
    if (value === null || value === undefined) {
      this.head = null;
      this.tail = null;
      this.length = 0;

      return;
    }

    const node: NodeLink = new NodeLink(value);

    this.head = node;
    this.tail = node;
    this.length = 1;
  }

  public append(value: unknown): NodeLink {
    const node: NodeLink = new NodeLink(value);

    if (!this.length) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;

    return node;
  }

  public prepend(value: unknown): NodeLink {
    const node: NodeLink = new NodeLink(value);

    if (!this.length) {
      this.tail = node;
    } else {
      node.next = this.head;
    }

    this.head = node;
    this.length++;

    return node;
  }

  public shift(): NodeLink | undefined {
    if (!this.length) return undefined;

    const node: NodeLink = this.head;

    node.next = null;
    this.head = this.head.next;
    this.length--;

    if (!this.length) {
      this.tail = null;
    }

    return node;
  }

  public pop(): NodeLink | undefined {
    if (!this.head) return undefined;

    let temp: NodeLink = this.head;
    let pre: NodeLink = this.head;

    while (temp.next) {
      pre = temp;
      temp = temp.next;
    }

    this.tail = pre;
    this.tail.next = null;
    this.length--;

    if (!this.length) {
      this.head = undefined;
      this.tail = undefined;
    }

    return temp;
  }


  public getByValue(value:unknown) {

    while(this.head !=null){
      if(this.head.value == value){
        return this.head.next.value;
      }
      this.head = this.head.next;
    }


  }




}