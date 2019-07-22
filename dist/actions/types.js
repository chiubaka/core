"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeCache = {};
function type(label) {
    if (typeCache[label]) {
        throw new Error(`Action type "${label}" is not unique`);
    }
    typeCache[label] = true;
    return label;
}
exports.type = type;

//# sourceMappingURL=../dist/actions/types.js.map
