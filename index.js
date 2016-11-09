'use strict';

const assert = require('assert');

function assign(obj, proto, description, other) {
	return Object.assign(Object.create(proto), obj, {
		description: Object.assign({}, obj.description, description),
	}, other);
}

const StringProto = {
};

const EnumProto = {
};

const ArrayProto = {
};

const ObjectProto = {
};

const NumberProto = {
	min: function(minimum) {
		return assign(this, NumberProto, { minimum: minimum }, {
			_test: value => this._test(value) && value >= minimum
		});
	},
	max: function(maximum) {
		return assign(this, NumberProto, { maximum: maximum }, {
			_test: value => this._test(value) && value <= maximum
		});
	}
};

const ParameterProto = {
	get optional() {
		return assign(this, ParameterProto, { optional: true }, {
			test: function(value) {
				return (value === undefined) ? true : this._test(value);
			}
		});
	},
	get string() {
		return assign(this, StringProto, { type: 'string' }, {
			_test: value => typeof value === 'string'
		});
	},
	get integer() {
		return assign(this, NumberProto, { type: 'integer' }, {
			_test: value => (typeof value === 'number') && (Math.floor(value) === value)
		});
	},
	get array() {
		return assign(this, ArrayProto, { type: 'array' }, {
			_test: value => Array.isArray(value)
		});
	},
	get object() {
		return assign(this, ObjectProto, { type: 'object' }, {
			_test: value => (value !== null) && (typeof value === 'object')
		});
	},
	oneOf: function(...values) {
		return assign(this, EnumProto, { type: 'enum', values: values }, {
			_test: value => values.indexOf(value) >= 0
		});
	}
};

module.exports = function(name) {
	assert(name !== undefined, 'No "name" parameter given');

	return assign({
		name: name,
		description: {},
		test: function(value) {
			return this._test(value)
		},
		_test: value => value !== undefined
	}, ParameterProto);
};
