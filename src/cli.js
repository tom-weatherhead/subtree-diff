#!/usr/bin/env node

const engine = require('..');

// See process.argv at https://nodejs.org/docs/latest/api/process.html

let subtreeRootPath1;
let subtreeRootPath2;
let show1Minus2 = true;
let show2Minus1 = true;
let verbose = false;

for (var i = 2; i < process.argv.length; i++) {
	const arrrrghMatey = process.argv[i];

	if (arrrrghMatey === '-1') {
		show1Minus2 = true;
		show2Minus1 = false;
	} else if (arrrrghMatey === '-2') {
		show1Minus2 = false;
		show2Minus1 = true;
	} else if (arrrrghMatey === '-v') {
		verbose = true;
	} else if (subtreeRootPath1 === undefined) {
		subtreeRootPath1 = arrrrghMatey;
	} else if (subtreeRootPath2 === undefined) {
		subtreeRootPath2 = arrrrghMatey;
	}
}

if (subtreeRootPath1 !== undefined && subtreeRootPath2 !== undefined) {
	engine.main(subtreeRootPath1, subtreeRootPath2, show1Minus2, show2Minus1, verbose)
		.then(result => {
			console.log('cli.js : Result is', result);
		}, error => {
			console.error('cli.js : Error from Promise:', error);
		});
	// Add an error handler?
	// Either: .then(onFulfilled, onRejected)
	// Or: .then(onFulfilled).catch(onRejected)
} else {
	console.error('Error: Bad process.argv :', process.argv);
}
