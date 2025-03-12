// EXAMPLE PRE-FORMATTING
// import fs from "fs";
// import { add, subtract } from "./math";
// import subtract from "./math"; // Duplicate import

// const x = 10 +3; // No space before operator
// if (x >10) console.log("X is greater than 10"); // Missing curly braces around console.log, no space before block

// function test() {
//     console.log("Test function"); // Incorrectly formatted function, no space before block
//     const y = 5;
//     const obj = {key: "value"}; // Space inside object braces
//     const arr = [1, 2 ,3]; // No space inside array brackets
//     const longString = "This is a very long string that will exceed the max length of 120 characters because we are testing ESLint to see if it can handle this properly and break the rules"; // Max length exceeded
//     fs.writeFileSync("example.txt", longString);
// }

// const z = 42;
// let result = add(x, z); // Used 'let' instead of 'const'

import fs from "fs";
import {add, subtract} from "./math";
// import subtract from "./math"; // Duplicate import

const x = 10 + 3; // No space before operator
if (x > 10) {
	console.log("X is greater than 10");
} // Missing curly braces around console.log, no space before block

function test() {
	console.log("Test function"); // Incorrectly formatted function, no space before block
	const y = 5;
	const obj = {key: "value"}; // Space inside object braces
	const arr = [1, 2, 3]; // No space inside array brackets
	const longString =
		"This is a very long string that will exceed the max length of 120 characters because we" +
		"are testing ESLint to see if it can handle this properly and break the rules"; // Max length exceeded
	fs.writeFileSync("example.txt", longString);
	fs.writeFileSync("example.txt", y);
	fs.writeFileSync("example.txt", obj);
	fs.writeFileSync("example.txt", arr);
}

test();
const z = 42;
const result = add(x, z); // Used 'let' instead of 'const'
const resultSubtract = subtract(x, z); // Use 'subtract'
fs.writeFileSync("example.txt", result);
fs.writeFileSync("example.txt", resultSubtract);

console.log("this is a commit test");
