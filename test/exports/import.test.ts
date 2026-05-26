import assert from 'assert';
import nextCallback from 'iterator-next-callback';
import Pinkie from 'pinkie-promise';

class Iterator<T> implements AsyncIterator<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  next(): Promise<IteratorResult<T>> {
    return new Pinkie((resolve: (value: IteratorResult<T>) => void) => {
      return resolve(this.values.length ? { done: false, value: this.values.shift() as T } : { done: true, value: undefined as unknown as T });
    });
  }
}

describe('exports .ts', () => {
  it('it should add a callback interface', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator.next().then((result: IteratorResult<number>) => {
      assert.equal(result.done, false);
      assert.equal(result.value, 1);

      iteratorCallback((err1, result) => {
        if (err1 || !result) return done(err1 ?? new Error('No result'));
        assert.equal(result.done, false);
        assert.equal(result.value, 2);
        done();
      });
    });
  });
});
