const DEFAULT = '___DEFAULT___';

function notImplemented(...args) {
  throw new Error(`Generic method not implemented for: ${JSON.stringify(args)}`);
}

/**
 * Registers new generic function implementation for provided dispatch value
 * @param  {Function} generic       Generic function to extend
 * @param  {Mixed}    dispatchValue DispatchValue
 * @param  {Function} imp           Method implementation
 * @return {Function}               Implementation
 */
export function defmethod(generic, dispatchValue, imp) {
  if (!generic._impls) {
    throw new Error('Not a generic function');
  }
  generic._impls.set(dispatchValue, imp);
  return imp;
}

/**
 * Creates new generic function
 * @param  {Function} dispatcher Dispatcher function
 * @param  {Function} def        Default implementation
 * @return {Function}            Created generic method
 */
export function defgeneric(dispatcher, def = notImplemented) {
  const impls = new Map();
  impls.set(DEFAULT, def);

  const fn = (...args) => {
    const dispatch = dispatcher.apply(null, args);
    return impls.has(dispatch) ?
      impls.get(dispatch).apply(null, args) :
      impls.get(DEFAULT).apply(null, args);
  };

  fn._impls = impls;

  return fn;
}
