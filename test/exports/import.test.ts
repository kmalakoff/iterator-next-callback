import assert from 'assert';
import Pinkie from 'pinkie-promise';

// @ts-ignore
import nextCallback from 'iterator-next-callback';

class Iterator<T> implements AsyncIterator<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  next() {
    return new Pinkie((resolve) => {
      return resolve(this.values.length ? { done: false, value: this.values.shift() } : { done: true, value: null });
    });
  }
}

describe('exports .ts', () => {
  it('it should add a callback interface', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator.next().then((result) => {
      assert.equal(result.done, false);
      assert.equal(result.value, 1);

      iteratorCallback((err1, result) => {
        assert.ok(!err1);
        assert.equal(result.done, false);
        assert.equal(result.value, 2);
        done();
      });
    });
  });
});
