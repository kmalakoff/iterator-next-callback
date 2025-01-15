import assert from 'assert';
import Pinkie from 'pinkie-promise';

// @ts-ignore
import nextCallback from 'iterator-next-callback';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function () {
  return new Promise((resolve) => {
    resolve(this.values.length ? this.values.shift() : null);
  });
};

describe('promise', () => {
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

    iterator
      .next()
      .then((value) => {
        assert.equal(value, 1);

        iteratorCallback((err1, value1) => {
          assert.ok(!err1);
          assert.equal(value1, 2);
          done();
        });
      })
      .catch((err) => {
        if (err) return done(err.message);
      });
  });
});
