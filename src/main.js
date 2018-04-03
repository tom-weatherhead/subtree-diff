const { exec } = require('child_process');

// find "$1" -type f -print0 | xargs --null md5sum | sort | uniq -D -w 32 >> $REPORT_FILENAME

function executeCommand (command) {
	// See https://nodejs.org/api/child_process.html
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {

			if (error) {
				console.error('Error executing command:', command, ':', error);
				reject(error);

				return;
			}

			// console.log('Executed command:', command);
			// console.log('stdout', stdout);

			if (stderr) {
				console.log('executeCommand() : stderr is', stderr);
			}

			resolve(stdout);
		});
	});
}

function getFileMD5Sums (subtreeRootPath) {
	// Return an object where each key is an MD5 checksum and each value is a list of paths.
	//let result = {};
	const command = `find "${subtreeRootPath}" -type f -print0 | xargs --null md5sum`;

	// console.log('getFileMD5Sums() : Command is:', command);

	//return result;
	return executeCommand(command)
		.then(result => {
			result = result.replace(/\r/g, '').split('\n');

			//console.log('getFileMD5Sums() : Result is', result);

			let foo = {};
			//const regex = /^([0-9a-f]){32}\s+(.+)$/;

			for (var line of result) {
				//let match = regex.exec(line);
				//console.log('getFileMD5Sums() : Line is', line);
				//console.log('getFileMD5Sums() : Match is', match);

				if (line.length > 32) {
					const md5sum = line.substr(0, 32);
					const filePath = line.substr(32).trim();

					// console.log('getFileMD5Sums() : md5sum is', md5sum);
					// console.log('getFileMD5Sums() : filePath is', filePath);

					if (foo[md5sum] === undefined) {
						foo[md5sum] = [];
					}

					foo[md5sum].push(filePath);
				}
			}

			// console.log('getFileMD5Sums() : foo is', foo);

			return Promise.resolve(foo);
		});
}

function main (subtreeRootPath1, subtreeRootPath2, show1Minus2, show2Minus1, verbose) {
	let result1;
	let result2;

	return getFileMD5Sums(subtreeRootPath1)
		.then(foo1 => {
			result1 = foo1;

			return getFileMD5Sums(subtreeRootPath2);
		})
		.then(foo2 => {
			result2 = foo2;

			// For each line in foo1 and foo2, match the regex: /^([0-9a-f]){32}\s+(.+)$/
			//const regex = /^([0-9a-f]){32}\s+(.+)$/;

			if (verbose) {
				console.log('main() : result1 is:', result1);
				console.log('main() : result2 is:', result2);
			}

			const keys1 = Object.keys(result1).sort();
			const keys2 = Object.keys(result2).sort();

			if (verbose) {
				console.log('main() : keys1 is:', keys1);
				console.log('main() : keys2 is:', keys2);
			}

			// Now: Determine which keys in result1 are not keys in result2 (diffResult1MinusResult2), and vice versa (diffResult2MinusResult1).

			// Then print the list of file paths for each key in diffResult1MinusResult2; then do the same for diffResult2MinusResult1.
			let result = {};

			if (show1Minus2) {
				const diffKeys1MinusKeys2 = keys1.filter(key1 => keys2.indexOf(key1) === -1);
				let diffFiles1MinusFiles2 = [];

				for (var key2 of diffKeys1MinusKeys2) {
					diffFiles1MinusFiles2 = diffFiles1MinusFiles2.concat(result1[key2]);
				}

				if (verbose) {
					console.log('main() : diffKeys1MinusKeys2 is:', diffKeys1MinusKeys2);
					console.log('main() : diffFiles1MinusFiles2 is:', diffFiles1MinusFiles2);
				}

				result.diffFiles1MinusFiles2 = diffFiles1MinusFiles2;
			}

			if (show2Minus1) {
				const diffKeys2MinusKeys1 = keys2.filter(key3 => keys1.indexOf(key3) === -1);
				let diffFiles2MinusFiles1 = [];

				for (var key4 of diffKeys2MinusKeys1) {
					diffFiles2MinusFiles1 = diffFiles2MinusFiles1.concat(result2[key4]);
				}

				if (verbose) {
					console.log('main() : diffKeys2MinusKeys1 is:', diffKeys2MinusKeys1);
					console.log('main() : diffFiles2MinusFiles1 is:', diffFiles2MinusFiles1);
				}

				result.diffFiles2MinusFiles1 = diffFiles2MinusFiles1;
			}

			return Promise.resolve(result);
		});
}

module.exports = {
	main: main
};
