"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = void 0;
const utils_js_1 = require("./utils.js");
const utils_js_2 = __importDefault(require("./utils.js"));
const greet = (name) => {
    return `Hello, ${name}!`;
};
exports.greet = greet;
console.log((0, exports.greet)("Raj"));
console.log("2 + 3 =", (0, utils_js_1.add)(2, 3));
console.log("4 * 5 =", (0, utils_js_1.multiply)(4, 5));
console.log("Math utils:", utils_js_2.default.add(10, 20));
//# sourceMappingURL=index.js.map