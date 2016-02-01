'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespace = namespace;
exports.defgeneric = defgeneric;
exports.defmethod = defmethod;
/**
 * Class representing not implemented error
 */
class GenericNotImplemented extends Error {
  /**
   * Create GenericNotImplemented error instance
   * @param  {String} method   Method name
   * @param  {[type]} dispatch Dispatch value
   */
  constructor(method) {
    let dispatch = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    super(`Generic method '${ method }'(${ dispatch ? dispatch : '' }) is not implemented`);
    Object.defineProperty(this, 'method', {
      value: method,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'dispatch', {
      value: dispatch,
      writable: false,
      configurable: false
    });
  }
}

exports.GenericNotImplemented = GenericNotImplemented; /**
                                                        * Creates new namespace for generics
                                                        * @param  {String} name Name of new namespace
                                                        * @return {Object}      Namespace to pass into defgeneric & defmethod
                                                        */

function namespace() {
  let name = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

  return name ? { _name: name } : {};
}

/**
 * Registers new generic method inside provided namespace
 * @param  {Object} ns  Namespace to use
 * @param  {String} name       Name of generic method
 * @param  {Function} dispatcher Dispatcher function
 * @return {Function}          Created generic method
 */
function defgeneric(ns, name, dispatcher) {
  var _this = this;

  ns[name] = new Map();
  const fn = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    const val = dispatcher.apply(null, args);
    if (!ns[name].has(val)) {
      throw new GenericNotImplemented(name, val);
    }
    return ns[name].get(val).apply(_this, args);
  };
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

/**
 * Registers new generic method implementation for provided dispatch value
 * @param  {Object}   namespace     Namespace to define method
 * @param  {String}   name          Name of generic method
 * @param  {Mixed}    dispatchValue DispatchValue
 * @param  {Function} imp           Method implementation
 * @return {Function}               Implementation
 */
function defmethod(ns, name, dispatchValue, imp) {
  if (!ns[name]) {
    throw new GenericNotImplemented(name);
  }
  ns[name].set(dispatchValue, imp);
  return imp;
}