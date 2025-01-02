export interface TNext<T> {
  value: T;
}

export type CallbackIteratorCallback<T> = (err?: Error, value?: T) => void;

export interface CallbackIterator<T> {
  next(callback?: CallbackIteratorCallback<T>): undefined | Promise<T>;
}
