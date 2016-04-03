'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.defmethod = defmethod;
exports.defgeneric = defgeneric;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT = '___DEFAULT___';

function notImplemented() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  throw new Error(`Generic method not implemented for: ${ (0, _stringify2.default)(args) }`);
}

/**
 * Registers new generic function implementation for provided dispatch value
 * @param  {Function} generic       Generic function to extend
 * @param  {Mixed}    dispatchValue DispatchValue
 * @param  {Function} imp           Method implementation
 * @return {Function}               Implementation
 */
function defmethod(generic, dispatchValue, imp) {
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
function defgeneric(dispatcher) {
  let def = arguments.length <= 1 || arguments[1] === undefined ? notImplemented : arguments[1];

  const impls = new _map2.default();
  impls.set(DEFAULT, def);

  const fn = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    const dispatch = dispatcher.apply(null, args);
    return impls.has(dispatch) ? impls.get(dispatch).apply(null, args) : impls.get(DEFAULT).apply(null, args);
  };

  fn._impls = impls;

  return fn;
}