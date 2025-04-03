export default (alphabet) => (regex) => {
    const prevRegex = `[${alphabet}λ)*]`;
    const currRegex = `[${alphabet}(]`;
    const needs_dot = (prev, curr) => prev.match(prevRegex) && curr.match(currRegex);

    return `(${[...regex].reduce((acc, curr, i, arr) =>
        acc + (i > 0 && needs_dot(arr[i - 1], curr) ? '.' : '') + curr,
    ''
    )}).#`;
};
