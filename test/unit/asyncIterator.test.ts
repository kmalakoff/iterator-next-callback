import assert from 'assert';
import nextCallback from 'iterator-next-callback';
import Pinkie from 'pinkie-promise';

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

describe('promise', () => {
  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

  it('it should add a callback interface', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator
      .next()
      .then((result) => {
        assert.equal(result.done, false);
        assert.equal(result.value, 1);

        iteratorCallback((err1, result) => {
          assert.ok(!err1);
          assert.equal(result.done, false);
          assert.equal(result.value, 2);
          done();
        });
      })
      .catch((err) => {
        if (err) {
          done(err.message);
          return;
        }
      });
  });
});
