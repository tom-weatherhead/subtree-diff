// subtree-diff/test/main_spec.js

'use strict';

const engine = require('..');

const chai = require('chai');
const expect = chai.expect;

//let appRoot = require('app-root-path');

//console.log('app-root-path: appRoot is', appRoot);

//const srcFilePath = path.join(appRoot.path, 'data/Dataset_presentation.csv');


describe('App', function () {
	const testCases = [
		{
			testName: 'Test 01',
			subtreeRootPath1: 'test/data/subtree1',
			subtreeRootPath2: 'test/data/subtree2',
			show1Minus2: true,
			show2Minus1: false,
			expectedResult: {}
		}
	];

	testCases.forEach(testCase => {
		// describe('Match regex against: ' + testCase.body, function () {
		describe(testCase.testName, function () {
			it('Rocks!', function (done) {
				//const options = testCase.options || {};

				// TODO: Use appRoot to create absolute versions of the relative paths subtreeRootPath1 and subtreeRootPath2.
				engine.main(testCase.subtreeRootPath1, testCase.subtreeRootPath2, testCase.show1Minus2, testCase.show2Minus1, false)
					.then(result => {
						expect(result).to.be.not.null;						// eslint-disable-line no-unused-expressions
						expect(result.diffFiles1MinusFiles2).to.be.not.null;						// eslint-disable-line no-unused-expressions
						expect(result.diffFiles1MinusFiles2.length).to.equal(1);
						expect(result.diffFiles1MinusFiles2[0]).to.equal('test/data/subtree1/B/file3.txt');
						done();
					}, error => {
						expect(error).to.be.not.null;						// eslint-disable-line no-unused-expressions
						expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
						done();
					})
					//.done()
				;
			});
		});
	});
});
