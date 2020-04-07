import { bindActionCreators } from 'redux';

export function shallowEqual(objA, objB) {
  if (typeof objA !== 'object') return objA === objB;
  if (objA === objB) return true;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

export function observeStore(store, currState, select, onChange) {
  if (typeof onChange !== 'function') return null;
  let currentState = currState === undefined ? {} : currState;

  function handleChange() {
    const nextState = select(store.getState());
    if (!shallowEqual(currentState, nextState)) {
      const previousState = currentState;
      currentState = nextState;
      onChange(currentState, previousState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

export const wrapActionCreators = actionCreators => dispatch => bindActionCreators(actionCreators, dispatch);
