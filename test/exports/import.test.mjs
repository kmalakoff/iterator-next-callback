import assert from 'assert';
import nextCallback from 'iterator-next-callback';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('exports .mjs', () => {
  it('it should add a callback interface', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const iteratorCallback = nextCallback(iterator);

    iterator.next((err, value) => {
      assert.ok(!err, err ? err.message : '');
      assert.equal(value, 1);

      iteratorCallback((err1, value1) => {
        assert.ok(!err1);
        assert.equal(value1, 2);
        done();
      });
    });
  });
});
