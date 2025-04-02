export default class {
    constructor() {
        this.items = [];
    };

    enqueue = (item) => {
        this.items.push(item);
    };

    dequeue = () => this.items.length === 0
        ? 'The queue is empty!'
        : this.items.shift();

    front = () => this.items[0];

    back = () => this.items[this.items.length - 1];

    size = () => this.items.length;

    empty = () => this.items.length === 0;
};
