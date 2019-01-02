
const convert = require('./index.js'),
	fs = require('fs.promisify');

convert('./test/3.svg', {width: 100, height: 100}).then((res) => {
	console.log(res);
	return fs.writeFile('3.png', res);
});
