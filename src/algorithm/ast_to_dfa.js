import utils from '@utils';

const { union } = utils.array;

export default ({ start, end, leaf_map }) => {
    const edge_list = [];
    const list_to_idx = {};
    const idx_to_list = {};
    let idx = 1;

    const create_edges = (node) => {
        const ans = {};
        for (const idx of node) {
            const { ch, followpos } = leaf_map[idx];
            if (ch === '#') {
                continue;
            }
            if (!(ch in ans)) {
                ans[ch] = [];
            }
            ans[ch] = union(ans[ch], followpos);
        }
        return ans;
    };

    const dfs = (node) => {
        list_to_idx[node] = idx;
        idx_to_list[idx] = node;
        idx++;

        const edges = create_edges(node);
        for (const ch in edges) {
            const to = edges[ch];
            if (!(to in list_to_idx)) {
                dfs(to);
            }
            edge_list.push({ from: list_to_idx[node], to: list_to_idx[to], ch });
        }
    };

    const get_final_states = () => {
        const ans = [];
        for (const list in list_to_idx) {
            const idx = list_to_idx[list];
            if (list.includes(end)) {
                ans.push(idx);
            }
        }
        return ans;
    }

    dfs(start);

    let ans = '';
    ans = `${ans}States:\n`;

    for (const idx in idx_to_list) {
        ans = `${ans}${idx} -> (${idx_to_list[idx]})\n`;
    }

    ans = `${ans}Initial state: ${list_to_idx[start]}\n`;
    ans = `${ans}Final states: ${get_final_states()}\n`;

    ans = `${ans}Edges:\n`;
    for (const edge of edge_list) {
        const { from, to, ch } = edge;
        ans = `${ans}${from} ${to} ${ch}\n`;
    }

    return ans;
};
