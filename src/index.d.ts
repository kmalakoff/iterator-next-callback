import type { IteratorCallback } from './types.ts';
export * from './types.ts';
export default function iteratorNextCallback<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>): IteratorCallback<T>;
