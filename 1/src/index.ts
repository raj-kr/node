import http from "http";
import { add, multiply } from "./utils";
import mathUtils from "./utils";

export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

console.log(greet("Raj"));
console.log("2 + 3 =", add(2, 3));
console.log("4 * 5 =", multiply(4, 5));
console.log("Math utils:", mathUtils.add(10, 20));
