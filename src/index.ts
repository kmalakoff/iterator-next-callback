import isPromise from 'is-promise';
import type { Callback, IteratorCallback } from './types.ts';

export * from './types.ts';

export default function iteratorNextCallback<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>): IteratorCallback<T> {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator && (iterator as AsyncIterable<T>)[Symbol.asyncIterator]) {
    return function nextAsyncIterable(callback: Callback<T>): void {
      (iterator as AsyncIterable<T>)
        [Symbol.asyncIterator]()
        .next()
        .then((result: IteratorResult<T>) => {
          callback(undefined, result);
        })
        .catch((err: Error) => {
          callback(err);
        });
    };
  }

  return function AsyncIterator(callback: Callback<T>): void {
    const result = (iterator as AsyncIterator<T, TReturn>).next();
    if (isPromise(result)) {
      result
        .then((result: IteratorResult<T>) => {
          callback(undefined, result);
        })
        .catch((err: Error) => {
          callback(err);
        });
    } else {
      callback(undefined, result);
    }
  };
}
