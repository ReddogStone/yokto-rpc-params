'use strict';

const assert = require('assert');

function assign(obj, proto, description, other) {
	return Object.assign(Object.create(proto), obj, {
		description: Object.assign({}, obj.description, description),
	}, other);
}

const testType = type => value => typeof value === type ? { ok: true } : {
	wrongType: { expected: type, actual: typeof value }
};

const BoolProto = {
};

const StringProto = {
};

const EnumProto = {
};

const ArrayProto = {
};

const ObjectProto = {
	property: function(propertyName) {
		return assign(this, ObjectProto, {
			properties: (this.description.properties || []).concat(propertyName)
		}, {
			_test: value => {
				let res = this._test(value);
				if (!res.ok) { return res; }
				return (value[propertyName] !== undefined) ? { ok: true } : { missingProperty: propertyName };
			}
		});		
	}
};

const NumberProto = {
	min: function(minimum) {
		return assign(this, NumberProto, { minimum: minimum }, {
			_test: value => {
				let res = this._test(value);
				if (!res.ok) { return res; }
				return (value >= minimum) ? { ok: true } : { valueTooSmall: value, minimum: minimum };
			}
		});
	},
	max: function(maximum) {
		return assign(this, NumberProto, { maximum: maximum }, {
			_test: value => {
				let res = this._test(value);
				if (!res.ok) { return res; }
				return (value <= maximum) ? { ok: true } : { valueTooBig: value, maximum: maximum };
			}
		});
	}
};

const ParameterProto = {
	get optional() {
		return assign(this, ParameterProto, { optional: true }, {
			test: function(value) {
				return (value === undefined) ? { ok: true } : this._test(value);
			}
		});
	},
	get boolean() {
		return assign(this, BoolProto, { type: 'boolean' }, {
			_test: testType('boolean')
		});
	},
	get string() {
		return assign(this, StringProto, { type: 'string' }, {
			_test: testType('string')
		});
	},
	get integer() {
		return assign(this, NumberProto, { type: 'integer' }, {
			_test: value => {
				let res = testType('number')(value);
				if (!res.ok) { return res; }
				return Math.floor(value) === value ? { ok: true } : {
					fractional: value
				};
			}
		});
	},
	get array() {
		return assign(this, ArrayProto, { type: 'array' }, {
			_test: value => Array.isArray(value) ? { ok: true } : { notArray: typeof value }
		});
	},
	get object() {
		return assign(this, ObjectProto, { type: 'object' }, {
			_test: value => {
				let res = testType('object')(value);
				if (!res.ok) { return res; }
				return value !== null ? { ok: true } : {
					isNull: true
				};				
			}
		});
	},
	oneOf: function(...values) {
		return assign(this, EnumProto, { type: 'enum', values: values }, {
			_test: value => values.indexOf(value) >= 0 ? { ok: true } : {
				notEnumValue: { expected: values, actual: value }
			}
		});
	}
};

module.exports = function(name) {
	assert(name !== undefined, 'No "name" parameter given');

	return assign({
		name: name,
		description: {},
		test: function(value) {
			return this._test(value);
		},
		_test: value => value !== undefined ? { ok: true } : { isUndefined: true }
	}, ParameterProto);
};
