const DEFAULT = Symbol('default');
const IMPLKEY = Symbol('imlementations');


function notImplemented(...args) {
  throw new Error(`Generic method not implemented for: ${JSON.stringify(args)}`);
}

/**
 * Registers new generic function implementation for provided dispatch value
 * @param  {Function} generic       Generic function to extend
 * @param  {Mixed}    dispatchValue DispatchValue
 * @param  {Function} imp           Method implementation
 * @returns {Function}               Implementation
 */
export function defmethod(generic, dispatchValue, imp) {
  if (!generic[IMPLKEY]) {
    throw new Error('Not a generic function');
  }
  generic[IMPLKEY].set(dispatchValue, imp);
  return imp;
}

/**
 * Creates new generic function
 * @param  {Function} dispatcher Dispatcher function
 * @param  {Function} def        Default implementation
 * @param  {Any}      th         This context for dispatcher function and method implementations
 * @returns {Function}           Resulting generic function
 */
export function defgeneric(dispatcher, def = notImplemented, th = null) {
  const impls = new Map();

  impls.set(DEFAULT, def);

  function f(...args) {
    const dispatch = dispatcher.apply(th, args);

    return impls.has(dispatch)
      ? impls.get(dispatch).apply(th, args)
      : impls.get(DEFAULT).apply(th, args);
  }

  f[IMPLKEY] = impls;

  return f;
}
