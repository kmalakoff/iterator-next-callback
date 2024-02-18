import isPromise from 'is-promise';

const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

export default function iteratorNextCallback(iterator) {
  if (HAS_ASYNC_ITERATOR && iterator[Symbol.asyncIterator]) {
    return function nextAsyncIterator(callback) {
      iterator[Symbol.asyncIterator]()
        .next()
        .then((result) => {
          callback(null, result.done ? null : result.value);
        })
        .catch((err) => {
          callback(err);
        });
    };
  }
  return function nextIteratorCallback(callback) {
    const result = iterator.next(callback);
    if (!result) return; // callback based callback

    // async iterator
    if (isPromise(result)) {
      result
        .then((result) => {
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        });
    }
    // synchronous iterator
    else {
      callback(null, result.value);
    }
  };
}
