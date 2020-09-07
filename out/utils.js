"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = exports.each = exports.getLastMatch = exports.getMatches = exports.keys = exports.assign = exports.isArray = void 0;
exports.isArray = Array.isArray;
exports.assign = Object.assign, exports.keys = Object.keys;
exports.getMatches = (regex, str) => {
    let match = null, matches = [];
    while ((match = regex.exec(str)) !== null) {
        matches.push(match);
    }
    return matches;
};
exports.getLastMatch = (regex, str) => {
    return exports.getMatches(regex, str).slice(-1).pop();
};
exports.each = (data, callback) => {
    exports.isArray(data) ?
        data.forEach(callback) :
        exports.keys(data).forEach(k => callback(data[k], k));
};
exports.reduce = (data, callback, initial) => {
    return exports.isArray(data) ?
        data.reduce(callback, initial) :
        exports.keys(data).reduce((prev, key) => callback(prev, data[key], key), initial);
};
//# sourceMappingURL=utils.js.map