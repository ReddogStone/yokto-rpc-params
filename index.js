'use strict';

const assert = require('assert');

const StringProto = {
};

const ParameterProto = {
	get optional() {
		return Object.assign(Object.create(ParameterProto), this, {
			description: Object.assign({}, this.description, { optional: true }),
			test: function(value) {
				return (value === undefined) ? true : this._test(value);
			}
		});
	},
	get string() {
		return Object.assign(Object.create(StringProto), this, {
			description: Object.assign({}, this.description, { type: 'string' }),
			_test: value => typeof value === 'string'
		});
	}
};

module.exports = function(name) {
	assert(name !== undefined, 'No "name" parameter given');

	return Object.assign(Object.create(ParameterProto), {
		name: name,
		description: {},
		test: function(value) {
			return this._test(value)
		},
		_test: value => value !== undefined
	});
};
