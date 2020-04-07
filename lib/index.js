function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./helpers", "is-class"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./helpers"), require("is-class"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.helpers, global.isClass);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, helpers, _isClass) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.provide = provide;
  _exports.connect = connect;
  _exports.helpers = void 0;
  helpers = _interopRequireWildcard(helpers);
  _exports.helpers = helpers;
  _isClass = _interopRequireDefault(_isClass);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var currentStore;

  var defaultMapState = function defaultMapState() {
    return {};
  };

  var defaultMapDispatch = function defaultMapDispatch(dispatch) {
    return {
      dispatch: dispatch
    };
  };

  function provide(store) {
    currentStore = store;
  }

  function connect() {
    var mapState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMapState;
    var mapDispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMapDispatch;

    if (typeof mapState !== 'function') {
      mapState = defaultMapState; // eslint-disable-line no-param-reassign
    }

    return function (component) {
      return function () {
        if (!currentStore) {
          throw new Error('You cannot use connect unless you `provide` a store');
        }

        var actions = (0, helpers.wrapActionCreators)(mapDispatch)(currentStore.dispatch);
        var currentState = mapState(currentStore.getState());
        var calledComponent;

        if ((0, _isClass["default"])(component)) {
          var Component = component;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          calledComponent = _construct(Component, args);
          calledComponent.state = currentState;
          calledComponent.actions = actions;
          if (typeof calledComponent.init === 'function') calledComponent.init();
          (0, helpers.observeStore)(currentStore, currentState, mapState, function (newState, oldState) {
            calledComponent.state = newState;
            if (typeof calledComponent.updated === 'function') calledComponent.updated(oldState);
          });
        } else {
          calledComponent = component(currentState, actions);

          if (calledComponent) {
            (0, helpers.observeStore)(currentStore, currentState, mapState, calledComponent.updated);
          }
        }

        return calledComponent;
      };
    };
  }
});