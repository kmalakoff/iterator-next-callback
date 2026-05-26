export type Callback<T, TReturn = unknown> = (error?: Error | null, result?: IteratorResult<T, TReturn>) => void;
export type IteratorCallback<T> = (callback: Callback<T>) => void;
