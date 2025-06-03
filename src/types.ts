export interface TNext<T> {
  value: T;
}

export type CallbackIteratorCallback<T> = (error?: Error, value?: T) => void;
export type CallbackIteratorNext<T> = (callback?: CallbackIteratorCallback<T>) => undefined;

export interface CallbackIterator<T> {
  next(callback?: CallbackIteratorCallback<T>): undefined;
}
