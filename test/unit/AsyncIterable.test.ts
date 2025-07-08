import assert from 'assert';
// @ts-ignore
import nextCallback from 'iterator-next-callback';
import Pinkie from 'pinkie-promise';

// biome-ignore lint/suspicious/noShadowRestrictedNames: Legacy
const Symbol: SymbolConstructor = typeof global.Symbol === 'undefined' ? ({ asyncIterator: undefined } as unknown as SymbolConstructor) : global.Symbol;
const hasAsyncIterable = typeof Symbol !== 'undefined' && Symbol.asyncIterator !== undefined;

class Iterator<T> implements AsyncIterable<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        return new Pinkie((resolve) => {
          return resolve(this.values.length ? { done: false, value: this.values.shift() } : { done: true, value: null });
        });
      },
    };
  }
}

describe('asyncIterator', () => {
  if (!hasAsyncIterable) return;

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

    iterator[Symbol.asyncIterator]()
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

  it('it should add a callback interface with synchronous built-ins', (done) => {
    const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const iterator = iterable[Symbol.iterator]();
    const iteratorCallback = nextCallback<number>(iterator as unknown as AsyncIterable<number>);

    const result = iterator.next();
    assert.equal(result.done, false);
    assert.equal(result.value, 1);

    iteratorCallback((err1, result) => {
      assert.ok(!err1);
      assert.equal(result.done, false);
      assert.equal(result.value, 2);
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
