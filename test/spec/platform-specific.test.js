const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

describe('platform specific', function () {
  if (HAS_ASYNC_ITERATOR) require('./asyncIterator');
});
