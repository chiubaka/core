"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
__export(require("./Model"));
function generateId() {
    return uuid.v4();
}
exports.generateId = generateId;

//# sourceMappingURL=../../dist/api/model/index.js.map
