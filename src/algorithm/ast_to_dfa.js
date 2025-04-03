import utils from '@utils';

const { union } = utils.array;

export default ({ start, end, leaf_map }) => {
    let idx = 1;
    const result = [];
    const edge_list = [];
    const list_to_idx = {};

    const create_edges = (node) =>
        node.reduce((acc, idx) => {
            const { ch, followpos } = leaf_map[idx];
            if (ch === '#') { return acc };
            return { ...acc, [ch]: union(acc[ch] || [], followpos) };
        }, {});

    const dfs = (node) => {
        if (node in list_to_idx) { return; }

        list_to_idx[node] = idx++;
        Object
            .entries(create_edges(node))
            .forEach(([ch, to]) => {
                dfs(to);
                edge_list.push({ from: list_to_idx[node], to: list_to_idx[to], ch });
            });
    };

    const final_states = () => Object
        .entries(list_to_idx)
        .filter(([list]) => list.includes(end))
        .map(([, idx]) => idx);

    dfs(start);

    result.push('States:\n');
    Object
        .entries(list_to_idx)
        .sort(([, idx1], [, idx2]) => idx1 - idx2)
        .forEach(([list, idx]) => {
            result.push(`${idx} -> (${list})\n`);
        });
    result.push(`Initial state: ${list_to_idx[start]}\n`);
    result.push(`Final states: ${final_states()}\n`);
    result.push('Edges:\n');
    edge_list.forEach(({ from, to, ch }) => result.push(`${from} ${to} ${ch}\n`));

    return result.join('');
};
