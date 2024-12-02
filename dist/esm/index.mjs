import isPromise from 'is-promise';
export default function iteratorNextCallback(iterator) {
    if (typeof Symbol !== 'undefined' && Symbol.asyncIterator && iterator[Symbol.asyncIterator]) {
        return function nextAsyncIterator(callback) {
            iterator[Symbol.asyncIterator]().next().then((result)=>{
                callback(null, result.done ? null : result.value);
            }).catch((err)=>{
                callback(err);
            });
        };
    }
    return function nextIteratorCallback(callback) {
        const result = iterator.next(callback);
        if (!result) return; // callback based callback
        // async iterator
        if (isPromise(result)) {
            result.then((result)=>{
                callback(null, result);
            }).catch((err)=>{
                callback(err);
            });
        } else {
            callback(null, result.value);
        }
    };
}
