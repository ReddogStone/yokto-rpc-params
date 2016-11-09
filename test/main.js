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
		it('an enum parameter with one value', function() {
			let p = Parameter('name').oneOf('Foo');
			assert.equal(p.description.type, 'enum');
			assert.equal(p.description.values.length, 1);
			assert.equal(p.description.values[0], 'Foo');
		});
		it('an enum parameter with two values', function() {
			let p = Parameter('name').oneOf('Foo', 'Bar');
			assert.equal(p.description.type, 'enum');
			assert.equal(p.description.values.length, 2);
			assert.equal(p.description.values[0], 'Foo');
			assert.equal(p.description.values[1], 'Bar');
		});
		it('an integer parameter', function() {
			let p = Parameter('name').integer;
			assert.equal(p.description.type, 'integer');
		});
		it('an integer parameter with a minimum value', function() {
			let p = Parameter('name').integer.min(10);
			assert.equal(p.description.minimum, 10);
		});
		it('an integer parameter with a maximum value', function() {
			let p = Parameter('name').integer.max(10);
			assert.equal(p.description.maximum, 10);
		});
		it('an integer parameter with both minimum and maximum', function() {
			let p = Parameter('name').integer.min(0).max(10);
			assert.equal(p.description.minimum, 0);
			assert.equal(p.description.maximum, 10);
		});
		it('an array parameter', function() {
			let p = Parameter('name').array;
			assert.equal(p.description.type, 'array');
		});
		it('an object parameter', function() {
			let p = Parameter('name').object;
			assert.equal(p.description.type, 'object');
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
		it('an enum parameter and a correct value', function() {
			let p = Parameter('name').oneOf('Foo');
			assert(p.test('Foo'));
		});
		it('an enum parameter with two values and a correct value', function() {
			let p = Parameter('name').oneOf('Foo', 'Bar');
			assert(p.test('Bar'));
		});
		it('an integer parameter and an integer value', function() {
			let p = Parameter('name').integer;
			assert(p.test(1));
		});
		it('an integer parameter with a minimum and the minimal value', function() {
			let p = Parameter('name').integer.min(10);
			assert(p.test(10));
		});
		it('an integer parameter with a minimum and a bigger value', function() {
			let p = Parameter('name').integer.min(10);
			assert(p.test(11));
		});
		it('an integer parameter with a maximum and the maximal value', function() {
			let p = Parameter('name').integer.max(10);
			assert(p.test(10));
		});
		it('an integer parameter with a maximum and a bigger value', function() {
			let p = Parameter('name').integer.max(10);
			assert(p.test(9));
		});
		it('an integer parameter with a minimum and maximum and a value in between', function() {
			let p = Parameter('name').integer.min(0).max(10);
			assert(p.test(9));
		});
		it('an array parameter and an empty array value', function() {
			let p = Parameter('name').array;
			assert(p.test([]));
		});
		it('an array parameter and an array value with one element', function() {
			let p = Parameter('name').array;
			assert(p.test([1]));
		});
		it('an object parameter and an empty object value', function() {
			let p = Parameter('name').object;
			assert(p.test({}));
		});
		it('an object parameter and an array value', function() {
			let p = Parameter('name').object;
			assert(p.test([]));
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
		it('an enum parameter and an incorrect value', function() {
			let p = Parameter('name').oneOf('Foo');
			assert(!p.test('Bar'));
		});
		it('an integer parameter and a string value', function() {
			let p = Parameter('name').integer;
			assert(!p.test('Bar'));
		});
		it('an integer parameter and a non-integer number value', function() {
			let p = Parameter('name').integer;
			assert(!p.test(2.2));
		});
		it('an integer parameter with a minimum and a smaller value', function() {
			let p = Parameter('name').integer.min(10);
			assert(!p.test(9));
		});
		it('an integer parameter with a maximum and a bigger value', function() {
			let p = Parameter('name').integer.max(10);
			assert(!p.test(11));
		});
		it('an integer parameter with a minimum and maximum and a smaller value', function() {
			let p = Parameter('name').integer.min(0).max(10);
			assert(!p.test(-1));
		});
		it('an integer parameter with a minimum and maximum and a bigger value', function() {
			let p = Parameter('name').integer.min(0).max(10);
			assert(!p.test(11));
		});
		it('an array parameter and a string value', function() {
			let p = Parameter('name').array;
			assert(!p.test('Foo'));
		});
		it('an array parameter and an object value', function() {
			let p = Parameter('name').array;
			assert(!p.test({}));
		});
		it('an object parameter and a string value', function() {
			let p = Parameter('name').object;
			assert(!p.test('Bla'));
		});
		it('an object parameter and a null value', function() {
			let p = Parameter('name').object;
			assert(!p.test(null));
		});
});

});