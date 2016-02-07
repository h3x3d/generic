/**
 * Class representing not implemented error
 */
export class GenericNotImplemented extends Error {
  /**
   * Create GenericNotImplemented error instance
   * @param  {String} method   Method name
   * @param  {[type]} dispatch Dispatch value
   */
  constructor(method, dispatch = null) {
    super(`Generic method '${method}'(${(dispatch ? dispatch : '')}) is not implemented`);
    Object.defineProperty(this, 'method', {
      value: method,
      writable: false,
      configurable: false,
    });
    Object.defineProperty(this, 'dispatch', {
      value: dispatch,
      writable: false,
      configurable: false,
    });
  }
}

/**
 * Creates new namespace for generics
 * @param  {String} name Name of new namespace
 * @return {Object}      Namespace to pass into defgeneric & defmethod
 */
export function namespace(name = undefined) {
  return name ? { _name: name } : {};
}

/**
 * Registers new generic method inside provided namespace
 * @param  {Object} ns  Namespace to use
 * @param  {String} name       Name of generic method
 * @param  {Function} dispatcher Dispatcher function
 * @return {Function}          Created generic method
 */
export function defgeneric(ns, name, dispatcher) {
  ns[name] = new Map();
  const fn = (...args) => {
    const val = dispatcher.apply(null, args);
    if (!ns[name].has(val)) {
      if (ns[name].has('_default')){
        return ns[name].get('_default').apply(this, args);
      }
      throw new GenericNotImplemented(name, val);
    }
    return ns[name].get(val).apply(this, args);
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
export function defmethod(ns, name, dispatchValue, imp) {
  if (!ns[name]) {
    throw new GenericNotImplemented(name);
  }
  ns[name].set(dispatchValue, imp);
  return imp;
}
