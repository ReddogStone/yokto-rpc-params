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
		it('an object parameter with a mandatory property', function() {
			let p = Parameter('name').object.property('prop');
			assert.equal(p.description.properties.length, 1);
			assert.equal(p.description.properties[0], 'prop');
		});
		it('an object parameter with two mandatory properties', function() {
			let p = Parameter('name').object.property('foo').property('bar');
			assert.equal(p.description.properties.length, 2);
			assert.equal(p.description.properties[0], 'foo');
			assert.equal(p.description.properties[1], 'bar');
		});
		it('a boolean parameter', function() {
			let p = Parameter('name').boolean;
			assert.equal(p.description.type, 'boolean');
		});
	});

	describe('tests positive for', function() {
		it('a basic parameter and a defined value', function() {
			let p = Parameter('name');
			assert(p.test('Something').ok);
		});
		it('a basic optional parameter and an undefined value', function() {
			let p = Parameter('name').optional;
			assert(p.test().ok);
		});
		it('a string parameter and a string value', function() {
			let p = Parameter('name').string;
			assert(p.test('string').ok);
		});
		it('an optional string parameter and a string value', function() {
			let p = Parameter('name').optional.string;
			assert(p.test('string').ok);
		});
		it('an optional string parameter and an undefined value', function() {
			let p = Parameter('name').optional.string;
			assert(p.test().ok);
		});
		it('an enum parameter and a correct value', function() {
			let p = Parameter('name').oneOf('Foo');
			assert(p.test('Foo').ok);
		});
		it('an enum parameter with two values and a correct value', function() {
			let p = Parameter('name').oneOf('Foo', 'Bar');
			assert(p.test('Bar').ok);
		});
		it('an integer parameter and an integer value', function() {
			let p = Parameter('name').integer;
			assert(p.test(1).ok);
		});
		it('an integer parameter with a minimum and the minimal value', function() {
			let p = Parameter('name').integer.min(10);
			assert(p.test(10).ok);
		});
		it('an integer parameter with a minimum and a bigger value', function() {
			let p = Parameter('name').integer.min(10);
			assert(p.test(11).ok);
		});
		it('an integer parameter with a maximum and the maximal value', function() {
			let p = Parameter('name').integer.max(10);
			assert(p.test(10).ok);
		});
		it('an integer parameter with a maximum and a bigger value', function() {
			let p = Parameter('name').integer.max(10);
			assert(p.test(9).ok);
		});
		it('an integer parameter with a minimum and maximum and a value in between', function() {
			let p = Parameter('name').integer.min(0).max(10);
			assert(p.test(9).ok);
		});
		it('an array parameter and an empty array value', function() {
			let p = Parameter('name').array;
			assert(p.test([]).ok);
		});
		it('an array parameter and an array value with one element', function() {
			let p = Parameter('name').array;
			assert(p.test([1].ok));
		});
		it('an object parameter and an empty object value', function() {
			let p = Parameter('name').object;
			assert(p.test({}).ok);
		});
		it('an object parameter and an array value', function() {
			let p = Parameter('name').object;
			assert(p.test([]).ok);
		});
		it('an object parameter with a mandatory property and a corresponding value', function() {
			let p = Parameter('name').object.property('prop');
			assert(p.test({ prop: 'foo' }).ok);
		});
		it('a boolean parameter with a true value', function() {
			let p = Parameter('name').boolean;
			assert(p.test(true).ok);
		});
		it('a boolean parameter with a false value', function() {
			let p = Parameter('name').boolean;
			assert(p.test(false).ok);
		});
	});

	describe('tests negative for', function() {
		it('a basic parameter and an undefined value', function() {
			let p = Parameter('name');
			assert(p.test().valueUndefined);
		});
		it('a string parameter and a non-string value', function() {
			let p = Parameter('name').string;
			let res = p.test(1);
			assert.equal(res.wrongType.expected, 'string');
			assert.equal(res.wrongType.actual, 'number');
		});
		it('an enum parameter and an incorrect value', function() {
			let p = Parameter('name').oneOf('Foo');
			let res = p.test('Bar');
			assert.equal(res.notEnumValue.expected.length, 1);
			assert.equal(res.notEnumValue.expected[0], 'Foo');
			assert.equal(res.notEnumValue.actual, 'Bar');
		});
		it('an integer parameter and a string value', function() {
			let p = Parameter('name').integer;
			let res = p.test('Bar');
			assert.equal(res.wrongType.expected, 'number');
			assert.equal(res.wrongType.actual, 'string');
		});
		it('an integer parameter and a non-integer number value', function() {
			let p = Parameter('name').integer;
			assert.equal(p.test(2.2).fractional, 2.2);
		});
		it('an integer parameter with a minimum and a smaller value', function() {
			let p = Parameter('name').integer.min(10);
			let res = p.test(9);
			assert.equal(res.valueTooSmall, 9);
			assert.equal(res.minimum, 10);
		});
		it('an integer parameter with a maximum and a bigger value', function() {
			let p = Parameter('name').integer.max(10);
			let res = p.test(11);
			assert.equal(res.valueTooBig, 11);
			assert.equal(res.maximum, 10);
		});
		it('an integer parameter with a minimum and maximum and a smaller value', function() {
			let p = Parameter('name').integer.min(0).max(10);
			let res = p.test(-1);
			assert.equal(res.valueTooSmall, -1);
			assert.equal(res.minimum, 0);
		});
		it('an integer parameter with a minimum and maximum and a bigger value', function() {
			let p = Parameter('name').integer.min(0).max(10);
			let res = p.test(11);
			assert.equal(res.valueTooBig, 11);
			assert.equal(res.maximum, 10);
		});
		it('an array parameter and a string value', function() {
			let p = Parameter('name').array;
			assert.equal(p.test('Foo').notArray, 'string');
		});
		it('an array parameter and an object value', function() {
			let p = Parameter('name').array;
			assert.equal(p.test({}).notArray, 'object');
		});
		it('an object parameter and a string value', function() {
			let p = Parameter('name').object;
			let res = p.test('Bla');
			assert.equal(res.wrongType.expected, 'object');
			assert.equal(res.wrongType.actual, 'string');
		});
		it('an object parameter and a null value', function() {
			let p = Parameter('name').object;
			assert(p.test(null).isNull);
		});
		it('an object parameter with a mandatory property and a value without this property', function() {
			let p = Parameter('name').object.property('prop');
			assert.equal(p.test({}).missingProperty, 'prop');
		});
		it('an object parameter with a mandatory property and a value with this property undefined', function() {
			let p = Parameter('name').object.property('prop');
			assert.equal(p.test({ prop: undefined }).missingProperty, 'prop');
		});
		it('a boolean parameter with a non-boolean value', function() {
			let p = Parameter('name').boolean;
			let res = p.test('Bla');
			assert.equal(res.wrongType.expected, 'boolean');
			assert.equal(res.wrongType.actual, 'string');
		});
	});
});