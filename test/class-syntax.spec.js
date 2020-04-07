import expect from 'expect';
import { provide, connect } from '../src';
import { createStore } from 'redux';
import { storeReducer, connectState, connectActions } from './utils/redux';

describe('class syntax', () => {
  let initSpy;
  let updatedSpy;
  let constructorSpy;
  let calledTestClass;
  before(() => {
    updatedSpy = expect.createSpy();
    initSpy = expect.createSpy();
    constructorSpy = expect.createSpy();
    class TestClass {
      constructor(...args) { constructorSpy(...args); }
      updated = updatedSpy;
      init = initSpy;
    }

    const store = createStore(storeReducer);
    provide(store);
    calledTestClass = connect(connectState, connectActions)(TestClass)(true);
  });

  it('should call class init function', () => {
    expect(initSpy).toHaveBeenCalled();
  });

  it('should not call updated', () => {
    expect(updatedSpy).toNotHaveBeenCalled();
  });

  it('should call the constructor with the argument of `true`', () => {
    expect(constructorSpy).toHaveBeenCalledWith(true);
  });

  it('should have state and actions', () => {
    expect(calledTestClass.state).toEqual([]);
    expect(calledTestClass.actions.foo).toBeA('function');
    expect(calledTestClass.actions.foo.toString()).toInclude('dispatch');
  });

  it('should be possible to call action functions', () => {
    calledTestClass.actions.foo();
  });

  describe('after action dispatch', () => {
    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(calledTestClass.state).toEqual([{ type: 'bar' }]); // new state
      expect(updatedSpy.calls[0].arguments[0]).toEqual([]); // old state
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(1);
    });
  });

  describe('second action dispatch', () => {
    before(() => {
      calledTestClass.actions.foo();
    });

    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(calledTestClass.state).toEqual([{ type: 'bar' }, { type: 'bar' }]);
      expect(updatedSpy.calls[1].arguments[0]).toEqual([{ type: 'bar' }]);
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(2);
    });

    it('should only call init function once', () => {
      expect(initSpy.calls.length).toBe(1);
    });
  });
});

describe('class syntax (called with `new` keyword)', () => {
  let initSpy;
  let updatedSpy;
  let calledTestClass;
  before(() => {
    updatedSpy = expect.createSpy();
    initSpy = expect.createSpy();
    const TestClass = class { updated = updatedSpy; init = initSpy };

    const store = createStore(storeReducer);
    provide(store);
    const UncalledTestClass = connect(connectState, connectActions)(TestClass);
    calledTestClass = new UncalledTestClass();
  });

  it('should call class init function', () => {
    expect(initSpy).toHaveBeenCalled();
  });

  it('should not call updated', () => {
    expect(updatedSpy).toNotHaveBeenCalled();
  });

  it('should have state and actions', () => {
    expect(calledTestClass.state).toEqual([]);
    expect(calledTestClass.actions.foo).toBeA('function');
    expect(calledTestClass.actions.foo.toString()).toInclude('dispatch');
  });

  it('should be possible to call action functions', () => {
    calledTestClass.actions.foo();
  });
});

describe('class without updated', () => {
  let initSpy;
  let calledTestClass;
  before(() => {
    initSpy = expect.createSpy();
    const TestClass = class { init = initSpy };

    const store = createStore(storeReducer);
    provide(store);
    calledTestClass = connect(connectState, connectActions)(TestClass)();
  });

  it('should call class init function', () => {
    expect(initSpy).toHaveBeenCalled();
  });

  it('should have state and actions', () => {
    expect(calledTestClass.state).toEqual([]);
    expect(calledTestClass.actions.foo).toBeA('function');
    expect(calledTestClass.actions.foo.toString()).toInclude('dispatch');
  });

  it('should be possible to call action functions', () => {
    calledTestClass.actions.foo();
  });

  describe('after action dispatch', () => {
    it('should call updated fn with new state', () => {
      expect(calledTestClass.state).toEqual([{ type: 'bar' }]); // new state
    });
  });

  describe('second action dispatch', () => {
    before(() => {
      calledTestClass.actions.foo();
    });

    it('should call updated fn with new state', () => {
      expect(calledTestClass.state).toEqual([{ type: 'bar' }, { type: 'bar' }]);
    });

    it('should only call init function once', () => {
      expect(initSpy.calls.length).toBe(1);
    });
  });
});

describe('class without init', () => {
  let updatedSpy;
  let calledTestClass;
  before(() => {
    updatedSpy = expect.createSpy();
    class TestClass { updated = updatedSpy; }

    const store = createStore(storeReducer);
    provide(store);
    calledTestClass = connect(connectState, connectActions)(TestClass)();
  });

  it('should not call updated', () => {
    expect(updatedSpy).toNotHaveBeenCalled();
  });

  it('should have state and actions', () => {
    expect(calledTestClass.state).toEqual([]);
    expect(calledTestClass.actions.foo).toBeA('function');
    expect(calledTestClass.actions.foo.toString()).toInclude('dispatch');
  });

  it('should be possible to call action functions', () => {
    calledTestClass.actions.foo();
  });

  describe('after action dispatch', () => {
    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(calledTestClass.state).toEqual([{ type: 'bar' }]); // new state
      expect(updatedSpy.calls[0].arguments[0]).toEqual([]); // old state
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(1);
    });
  });

  describe('second action dispatch', () => {
    before(() => {
      calledTestClass.actions.foo();
    });

    it('should call updated fn with new state', () => {
      expect(updatedSpy).toHaveBeenCalled();
      expect(calledTestClass.state).toEqual([{ type: 'bar' }, { type: 'bar' }]);
      expect(updatedSpy.calls[1].arguments[0]).toEqual([{ type: 'bar' }]);
    });

    it('should not call updated fn twice', () => {
      expect(updatedSpy.calls.length).toBe(2);
    });
  });
});
