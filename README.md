# yokto-rpc-params

Minimal RPC parameter library

# example

``` js
const Parameter = require('yokto-rpc-params');

let p = Parameter('foo')
	.optional
	.integer.min(10).max(100);

p.description;      // { optional: true, type: 'integer', minimum: 10, maximum: 100 }
p.test(undefined);  // true - optional parameter
p.test(100);        // true - integer, value >=10 and <=100
p.test(100.1);      // false - not integer
p.test(9);          // false - integer, but value <10
p.test(101);        // false - integer, but value >100

let p = Parameter('foo')
	.object.property('bar').property('baz');

p.description;              // { type: 'object', properties: [ 'bar', 'baz' ] }
p.test(undefined);          // false - non-optional parameter
p.test(100);                // false - non-object value
p.test({});                 // false - mandatory properties "bar" and "baz" not present
p.test({ bar: 1, baz: 2});  // true - value is object and mandatory properties are present

```

## License

MIT
