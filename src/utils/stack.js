export default class {
    constructor() {
        this.items = [];
    };

    push = (item) => {
        this.items.push(item);
    };

    pop = () => this.items.length === 0
        ? 'The stack is empty!'
        : this.items.pop();

    top = () => this.items[this.items.length - 1];

    size = () => this.items.length;

    empty = () => this.items.length === 0;
};
