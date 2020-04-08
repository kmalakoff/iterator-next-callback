var isPromise = require('./lib/isPromise');

var HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function iteratorNextCallback(iterator) {
  if (HAS_ASYNC_ITERATOR && iterator[Symbol.asyncIterator]) {
    return function nextAsyncIterator(callback) {
      iterator[Symbol.asyncIterator]()
        .next()
        .then(function (result) {
          callback(null, result.done ? null : result.value);
        })
        .catch(function (err) {
          callback(err);
        });
    };
  }
  return function nextIteratorCallback(callback) {
    var result = iterator.next(callback);
    if (isPromise(result))
      result
        .then(function (result) {
          callback(null, result);
        })
        .catch(function (err) {
          callback(err);
        });
  };
};
