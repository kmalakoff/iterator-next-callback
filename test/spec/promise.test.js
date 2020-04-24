var assert = require('assert');
var nextCallback = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function () {
  var self = this;
  return new Promise(function (resolve) {
    resolve(self.values.length ? self.values.shift() : null);
  });
};

describe('promise', function () {
  if (typeof Promise === 'undefined') return; // no promise support

  it('it should add a callback interface', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var iteratorCallback = nextCallback(iterator);

    iterator
      .next()
      .then(function (value) {
        assert.equal(value, 1);

        iteratorCallback(function (err1, value1) {
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
