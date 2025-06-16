import isPromise from 'is-promise';
import type { Callback, IteratorCallback } from './types.js';

export * from './types.js';

export default function iteratorNextCallback<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>): IteratorCallback<T> {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator && iterator[Symbol.asyncIterator]) {
    return function nextAsyncIterable(callback: Callback<T>): undefined {
      iterator[Symbol.asyncIterator]()
        .next()
        .then((result) => {
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        });
    };
  }

  return function AsyncIterator(callback: Callback<T>): undefined {
    const result = (iterator as AsyncIterator<T, TReturn>).next();
    if (isPromise(result)) {
      result
        .then((result) => {
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        });
    } else {
      callback(null, result);
    }
  };
}
