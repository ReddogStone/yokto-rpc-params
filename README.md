# yokto-rpc-params

Minimal RPC parameter library

# example

``` js
const Parameter = require('yokto-rpc-params');

let p = Parameter('foo')
	.optional
	.integer.min(10).max(100);

p.description;      // { optional: true, type: "integer", minimum: 10, maximum: 100 }
p.test(undefined);  // { ok: true } - optional parameter
p.test(100);        // { ok: true } - integer, value >=10 and <=100
p.test(100.1);      // { fractional: 100.1 }
p.test(9);          // { valueTooSmall: 9, minimum: 10 }
p.test(101);        // { valueTooBig: 101, maximum: 100 }

p = Parameter('foo')
	.object.property('bar').property('baz');

p.description;              // { type: "object", properties: [ "bar", "baz" ] }
p.test(undefined);          // { isUndefined: true }
p.test(100);                // { wrongType: { expected: "object", actual: "number" } }
p.test({});                 // { missingProperty: "bar" }
p.test({ bar: 1, baz: 2});  // { ok: true } - value is object and mandatory properties are present

```

## License

MIT
