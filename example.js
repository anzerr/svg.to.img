
const svg2img = require('./index.js'),
	fs = require('fs.promisify');

svg2img('./test/fy.svg', {width: 100, height: 100}).then((res) => {
	console.log(res);
	return fs.writeFile('out.png', res);
});
