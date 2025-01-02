import isPromise from 'is-promise';

import type { CallbackIterator, CallbackIteratorCallback, TNext } from './types';

export * from './types';
export default function iteratorNextCallback<T>(iterator: AsyncIterable<T> | CallbackIterator<T>) {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator && iterator[Symbol.asyncIterator]) {
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
  return function next(callback?: CallbackIteratorCallback<T>): Promise<T> | undefined {
    const result = (iterator as CallbackIterator<T>).next(callback);
    if (!result) return; // callback based callback

    // async iterator
    if (isPromise(result)) {
      (result as Promise<T>)
        .then((result) => {
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        });
    }
    // synchronous iterator
    else {
      callback(null, (result as TNext<T>).value);
    }
  };
}
