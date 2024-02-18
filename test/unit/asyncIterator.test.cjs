const assert = require('assert');
const nextCallback = require('iterator-next-callback');

const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

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
  if (!HAS_ASYNC_ITERATOR) return;

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
        assert.ok(!err);
      });
  });

  it('it should add a callback interface with synchronous built-ins', (done) => {
    const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const iterator = iterable[Symbol.iterator]();
    const iteratorCallback = nextCallback(iterator);

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
        assert.ok(!err);
      });
  });
});
