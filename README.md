## iterator-next-callback

Calls async iterator next using a callback format.

```sh
npm install iterator-next-callback
```

```js
var nextCallback = require('iterator-next-callback');
var assert = require('assert');

async function* createAsyncIterable(iterable) {
  for (const elem of iterable) {
    yield elem;
  }
}

var iterator = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
var next = nextCallback(iterator);

next(function (err, result) {
  if (err) throw err;
  assert.equal(result.value, 1);
});

```
