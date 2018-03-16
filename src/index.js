import * as helpers from './helpers';
import { observeStore, wrapActionCreators } from './helpers';
import isClass from 'is-class';

let currentStore;

const defaultMapState = () => ({});
const defaultMapDispatch = dispatch => ({ dispatch });

export {helpers};

export function provide(store) { currentStore = store; }

export function connect(mapState = defaultMapState, mapDispatch = defaultMapDispatch) {
  if (typeof mapState !== 'function') {
    mapState = defaultMapState; // eslint-disable-line no-param-reassign
  }
  return component => () => {
    if (!currentStore) {
      throw new Error('You cannot use connect unless you `provide` a store');
    }

    const actions = wrapActionCreators(mapDispatch)(currentStore.dispatch);
    const currentState = mapState(currentStore.getState());

    let calledComponent;
    if (isClass(component)) {
      const Component = component;
      calledComponent = new Component();
      calledComponent.state = currentState;
      calledComponent.actions = actions;
      if (typeof calledComponent.init === 'function') calledComponent.init();
      observeStore(currentStore, currentState, mapState, (newState, oldState) => {
        calledComponent.state = newState;
        if (typeof calledComponent.updated === 'function') calledComponent.updated(oldState);
      });
    } else {
      calledComponent = component(currentState, actions);
      if (calledComponent) {
        observeStore(currentStore, currentState, mapState, calledComponent.updated);
      }
    }
    return calledComponent;
  };
}
