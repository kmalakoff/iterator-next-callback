const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

!HAS_ASYNC_ITERATOR || require('./asyncIterator');
