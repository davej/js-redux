export const storeReducer = (x = [], y) => (!y.type.includes('@@redux/') ? [...x, y] : x);
export const connectState = state => state;
export const connectActions = { foo: () => ({ type: 'bar' }) };
