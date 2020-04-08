var assert = require('assert');
var nextCallback = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype[Symbol.asyncIterator] = function () {
  var self = this;
  return { next: nextPromise };

  function nextPromise() {
    return new Promise(function (resolve) {
      var value = self.values.length ? self.values.shift() : null;
      return resolve({ value: value, done: value === null });
    });
  }
};

describe('asyncIterator', function () {
  it('it should add a callback interface', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var callback = nextCallback(iterator);

    iterator[Symbol.asyncIterator]()
      .next()
      .then(function (result) {
        assert.equal(result.value, 1);

        callback(function (err1, value1) {
          assert.ok(!err1);
          assert.equal(value1, 2);
          done();
        });
      })
      .catch(function (err) {
        assert.ok(!err);
      });
  });

  it('it should add a callback interface with synchronous built-ins', function (done) {
    var iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var iterator = iterable[Symbol.iterator]();
    var callback = nextCallback(iterator);

    var result = iterator.next();
    assert.equal(result.value, 1);

    callback(function (err1, value1) {
      assert.ok(!err1);
      assert.equal(value1, 2);
      done();
    });
  });

  it('it should add a callback interface with asynchronous built-ins', function (done) {
    async function* createAsyncIterable(iterable) {
      for (const elem of iterable) {
        yield elem;
      }
    }

    var iterator = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var callback = nextCallback(iterator);

    iterator
      .next()
      .then(function (result) {
        assert.equal(result.value, 1);

        callback(function (err1, value1) {
          assert.ok(!err1);
          assert.equal(value1, 2);
          done();
        });
      })
      .catch(function (err) {
        assert.ok(!err);
      });
  });
});
