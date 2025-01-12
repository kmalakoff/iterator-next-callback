import assert from 'assert';
import Pinkie from 'pinkie-promise';

// @ts-ignore
import nextCallback from 'iterator-next-callback';
// @ts-ignore
import type { CallbackIterator } from 'iterator-next-callback';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype[Symbol.asyncIterator] = function () {
  const self = this;
  return { next: nextPromise };

  function nextPromise() {
    return new Promise((resolve) => {
      const value = self.values.length ? self.values.shift() : null;
      return resolve({ value: value, done: value === null });
    });
  }
};

describe('asyncIterator', () => {
  if (typeof Symbol === 'undefined' || !Symbol.asyncIterator) return;
  (() => {
    // patch and restore promise
    // @ts-ignore
    let rootPromise: Promise;
    before(() => {
      rootPromise = global.Promise;
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = rootPromise;
    });
  })();

  it('it should add a callback interface', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator[Symbol.asyncIterator]()
      .next()
      .then((result) => {
        assert.equal(result.value, 1);

        iteratorCallback((err1, value1) => {
          assert.ok(!err1);
          assert.equal(value1, 2);
          done();
        });
      })
      .catch((err) => {
        if (err) return done(err);
      });
  });

  it('it should add a callback interface with synchronous built-ins', (done) => {
    const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const iterator = iterable[Symbol.iterator]();
    const iteratorCallback = nextCallback<number>(iterator as unknown as CallbackIterator<number>);

    const result = iterator.next();
    assert.equal(result.value, 1);

    iteratorCallback((err1, value1) => {
      assert.ok(!err1);
      assert.equal(value1, 2);
      done();
    });
  });

  it('it should add a callback interface with asynchronous built-ins', (done) => {
    async function* createAsyncIterable(iterable) {
      for (const elem of iterable) {
        yield elem;
      }
    }

    const iterator = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator
      .next()
      .then((result) => {
        assert.equal(result.value, 1);

        iteratorCallback((err1, value1) => {
          assert.ok(!err1);
          assert.equal(value1, 2);
          done();
        });
      })
      .catch((err) => {
        if (err) return done(err);
      });
  });
});
