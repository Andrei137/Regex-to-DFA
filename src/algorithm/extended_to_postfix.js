import utils from '@utils';

export default (alphabet) => (infix) => {
    const op_stack = new utils.stack();
    const out_queue = new utils.queue();
    const precedence = Object
        .fromEntries(['|', '.', '*', ')']
        .map((op, i) => [op, i]));

    for (const ch of infix) {
        if (`${alphabet}λ#`.includes(ch)) {
            out_queue.enqueue(ch);
        }
        else if (ch === '(') {
            op_stack.push(ch);
        }
        else if (ch === ')') {
            while (!op_stack.empty() && op_stack.top() !== '(') {
                out_queue.enqueue(op_stack.pop());
            }
            if (op_stack.empty()) {
                throw new Error('Unmatched parentheses');
            }
            op_stack.pop();
        }
        else if ('*|.'.includes(ch)) {
            while (
                !op_stack.empty() &&
                '*|.)'.includes(op_stack.top()) &&
                precedence[op_stack.top()] >= precedence[ch]
            ) {
                out_queue.enqueue(op_stack.pop());
            }
            op_stack.push(ch);
        }
        else {
            throw new Error(`Invalid character: ${ch}`);
        }
    }

    while (!op_stack.empty()) {
        if (op_stack.top() === '(') {
            throw new Error('Unmatched parentheses');
        }
        out_queue.enqueue(op_stack.pop());
    }

    return out_queue.to_string();
};
