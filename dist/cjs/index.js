"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return iteratorNextCallback;
    }
});
var _ispromise = /*#__PURE__*/ _interop_require_default(require("is-promise"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var HAS_ASYNC_ITERATOR = typeof Symbol !== "undefined" && Symbol.asyncIterator;
function iteratorNextCallback(iterator) {
    if (HAS_ASYNC_ITERATOR && iterator[Symbol.asyncIterator]) {
        return function nextAsyncIterator(callback) {
            iterator[Symbol.asyncIterator]().next().then(function(result) {
                callback(null, result.done ? null : result.value);
            }).catch(function(err) {
                callback(err);
            });
        };
    }
    return function nextIteratorCallback(callback) {
        var result = iterator.next(callback);
        if (!result) return; // callback based callback
        // async iterator
        if ((0, _ispromise.default)(result)) {
            result.then(function(result) {
                callback(null, result);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            callback(null, result.value);
        }
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }