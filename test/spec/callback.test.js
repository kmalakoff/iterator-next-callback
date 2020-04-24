var assert = require('assert');
var nextCallback = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('callback', function () {
  it('it should add a callback interface', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var iteratorCallback = nextCallback(iterator);

    iterator.next(function (err, value) {
      assert.ok(!err);
      assert.equal(value, 1);

      iteratorCallback(function (err1, value1) {
        assert.ok(!err1);
        assert.equal(value1, 2);
        done();
      });
    });
  });
});
