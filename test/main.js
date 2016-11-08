'use strict';

const assert = require('assert');
const Parameter = require('../index');

describe('Parameter', function() {
	it('requires a name parameter', function() {
		assert.throws(function() {
			Parameter()
		});
	});

	it('creates an object with a name', function() {
		let p = Parameter('name');
		assert.equal(p.name, 'name');
	});

	it('creates an object with a description', function() {
		let p = Parameter('name');
		assert.notEqual(p.description, undefined);
	});

	describe('creates a correct description for', function() {
		it('an optional parameter', function() {
			let p = Parameter('name').optional;
			assert.equal(p.description.optional, true);
		});
		it('an optional parameter and keeps the name', function() {
			let p = Parameter('name').optional;
			assert.equal(p.name, 'name');
		});
		it('a string parameter', function() {
			let p = Parameter('name').string;
			assert.equal(p.description.type, 'string');
		});
	});

	describe('tests positive for', function() {
		it('a basic parameter and a defined value', function() {
			let p = Parameter('name');
			assert(p.test('Something'));
		});
		it('a basic optional parameter and an undefined value', function() {
			let p = Parameter('name').optional;
			assert(p.test());
		});
		it('a string parameter and a string value', function() {
			let p = Parameter('name').string;
			assert(p.test('string'));
		});
		it('an optional string parameter and a string value', function() {
			let p = Parameter('name').optional.string;
			assert(p.test('string'));
		});
		it('an optional string parameter and an undefined value', function() {
			let p = Parameter('name').optional.string;
			assert(p.test());
		});
	});

	describe('tests negative for', function() {
		it('a basic parameter and an undefined value', function() {
			let p = Parameter('name');
			assert(!p.test());
		});
		it('a string parameter and a non-string value', function() {
			let p = Parameter('name').string;
			assert(!p.test(1));
		});
	});

});