import isPromise from 'is-promise';

import type { CallbackIterator, CallbackIteratorCallback, CallbackIteratorNext, TNext } from './types.js';

export * from './types.js';

export default function iteratorNextCallback<T>(iterator: AsyncIterable<T>): undefined;
export default function iteratorNextCallback<T>(iterator: CallbackIterator<T>): undefined;
export default function iteratorNextCallback<T>(iterator: AsyncIterable<T> | CallbackIterator<T>): CallbackIteratorNext<T> | undefined {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator && iterator[Symbol.asyncIterator]) {
    return function nextAsyncIterator(callback: CallbackIteratorCallback<T>): undefined {
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
  return function next(callback?: CallbackIteratorCallback<T>): undefined {
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
