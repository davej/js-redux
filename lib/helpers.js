(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "redux"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("redux"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.redux);
    global.helpers = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _redux) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.shallowEqual = shallowEqual;
  _exports.observeStore = observeStore;
  _exports.wrapActionCreators = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function shallowEqual(objA, objB) {
    if (_typeof(objA) !== 'object') return objA === objB;
    if (objA === objB) return true;
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false; // Test for A's keys different from B.

    var hasOwn = Object.prototype.hasOwnProperty;

    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }

  function observeStore(store, currState, select, onChange) {
    if (typeof onChange !== 'function') return null;
    var currentState = currState === undefined ? {} : currState;

    function handleChange() {
      var nextState = select(store.getState());

      if (!shallowEqual(currentState, nextState)) {
        var previousState = currentState;
        currentState = nextState;
        onChange(currentState, previousState);
      }
    }

    var unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }

  var wrapActionCreators = function wrapActionCreators(actionCreators) {
    return function (dispatch) {
      return (0, _redux.bindActionCreators)(actionCreators, dispatch);
    };
  };

  _exports.wrapActionCreators = wrapActionCreators;
});