const { OpraFilter } = require('@opra/common');
const ast = OpraFilter.parse("productId='123'");
console.log('TYPE:', typeof ast);
console.log('STRING:', String(ast));
