import utils from '@utils';

class ASTNode {
    constructor(key, left, right, nullable, firstpos, lastpos, followpos=[]) {
        this.key = key;
        this.left = left;
        this.right = right;
        this.nullable = nullable;
        this.firstpos = firstpos;
        this.lastpos = lastpos;
        this.followpos = followpos;
    }
}

export default (alphabet) => (postfix) => {
    const ast_stack = new utils.stack();
    const leaf_map = {};
    let leaf_idx = 1;

    const union = (arr1, arr2) => Array.from(new Set([...arr1, ...arr2]));
    const update_followpos = (node1, node2) => {
        for (const i of node1.lastpos) {
            leaf_map[i].followpos = union(leaf_map[i].followpos, node2.firstpos);
        }
    }
    
    for (const ch of postfix) {
        if (`${alphabet}λ#`.includes(ch)) {
            const nullable = (ch === 'λ');
            const pos = nullable
                ? [] 
                : [leaf_idx];
            ast_stack.push(new ASTNode(ch, null, null, nullable, pos, pos));
            leaf_map[leaf_idx] = ast_stack.top();
            leaf_idx += !nullable;
        }
        else if (ch === '*') {
            const left = ast_stack.pop();
            update_followpos(left, left);
            ast_stack.push(new ASTNode(ch, left, null, true, left.firstpos, left.lastpos));
        }
        else {
            const right = ast_stack.pop();
            const left = ast_stack.pop();
            let nullable, firstpos, lastpos;

            if (ch === '|') {
                nullable = left.nullable || right.nullable;
                firstpos = union(left.firstpos, right.firstpos);
                lastpos = union(left.lastpos, right.lastpos);
            }
            else {
                nullable = left.nullable && right.nullable;
                firstpos = left.nullable
                    ? union(left.firstpos, right.firstpos)
                    : left.firstpos;
                lastpos = right.nullable
                    ? union(left.lastpos, right.lastpos)
                    : right.lastpos;
                update_followpos(left, right);
            }
            ast_stack.push(new ASTNode(ch, left, right, nullable, firstpos, lastpos));
        }
    }

    const root = ast_stack.pop();

    if (!ast_stack.empty()) {
        throw new Error("Error in creating the AST.");
    }

    return {
        'start': root.firstpos,
        'end'  : root.lastpos[0],
        leaf_map,
    };
};