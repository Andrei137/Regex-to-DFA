import utils from '@utils';

const { union } = utils.array;

export default (alphabet) => (postfix) => {
    const ast_stack = new utils.stack();
    const leaf_map = {};
    let leaf_idx = 1;

    const update_followpos = (node1, node2) => {
        node1.lastpos.forEach(i => {
            leaf_map[i].followpos = union(leaf_map[i].followpos, node2.firstpos);
        });
    }

    for (const ch of postfix) {
        if (`${alphabet}λ#`.includes(ch)) {
            const nullable = ch === 'λ';
            const pos = nullable ? [] : [leaf_idx];

            ast_stack.push({ ch, nullable, firstpos: pos, lastpos: pos, followpos: [] });

            if (!nullable) {
                leaf_map[leaf_idx++] = { ch, followpos: [] };
            }
        }
        else if (ch === '*') {
            const left = ast_stack.pop();
            update_followpos(left, left);
            ast_stack.push({ ...left, ch, left, nullable: true });
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
            ast_stack.push({ ch, left, right, nullable, firstpos, lastpos });
        }
    }

    const root = ast_stack.pop();
    if (!ast_stack.empty()) {
        throw new Error('Error in creating the AST!');
    }

    return {
        start: root.firstpos,
        end: root.lastpos[0],
        leaf_map,
    };
};
