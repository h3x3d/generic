/**
 * Class representing not implemented error
 */
export class GenericNotImplemented extends Error {
  /**
   * Create GenericNotImplemented error instance
   * @param  {String} method   Method name
   * @param  {[type]} dispatch Dispatch value
   */
  constructor(method, dispatch = null){
    super(`Generic method '${method}' is not implemented` + (dispatch ? ` for dispatch value '${dispatch}'` : ''));
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

/**
 * Creates new namespace for generics
 * @param  {String} name Name of new namespace
 * @return {Object}      Namespace to pass into defgeneric & defmethod
 */
export function namespace(name = undefined){
  return name ? {_name: name} : {};
}

/**
 * Registers new generic method inside provided namespace
 * @param  {Object} namespace  Namespace to use
 * @param  {String} name       Name of generic method
 * @param  {Function} dispatcher Dispatcher function
 * @return {Function}          Created generic method
 */
export function defgeneric(namespace, name, dispatcher){
  namespace[name] = new Map();
  let fn = function(...args) {
    let val = dispatcher.apply(null, args);
    if(!namespace[name].has(val)){
      throw new GenericNotImplemented(name, val);
    }
    return namespace[name].get(val).apply(this, args);
  }
  Object.defineProperty(fn, 'name', {value: name});
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
export function defmethod(namespace, name, dispatchValue, imp){
  if(!namespace[name]){
    throw new GenericNotImplemented(name);
  }
  namespace[name].set(dispatchValue, imp);
  return imp;
}