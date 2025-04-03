const union = (arr1, arr2) => Array.from(new Set([...arr1, ...arr2]));

export default {
    union,
};