
const {Canvg, presets} = require('canvg'),
	canvas = require('canvas'),
	{DOMParser} = require('xmldom'),
	http = require('http'),
	fs = require('fs.promisify'),
	scale = require('./scale.js'),
	https = require('https');

console.log(DOMParser);

const preset = presets.node({
	DOMParser: DOMParser,
	canvas: canvas
});

const util = {

	scale: scale,

	canvas: (svg, width, height) => {
		const c = preset.createCanvas(width, height);
		const ctx = c.getContext('2d');
		const v = Canvg.fromString(ctx, svg, preset);
		return v.render().then(() => c);
	},

	get: (url) => {
		return new Promise((resolve, reject) => {
			(url.match(/^https\:\/\//) ? https : http).get(url, (res) => {
				let data = [];
				res.on('data', (chunk) => {
					data.push(chunk);
				}).on('end', () => {
					resolve(Buffer.concat(data));
				});
			}).on('error', (e) => reject(e));
		});
	}
};

util.load = (svg) => {
	if (Buffer.isBuffer(svg)) {
		let tmp = svg.slice(0, 26).toString();
		if (tmp.match(/^data\:image\/svg\+xml;base64,/)) {
			return Promise.resolve(Buffer.from(svg.slice(26, svg.length), 'base64'));
		}
		if (tmp.indexOf(/^<svg/)) {
			return Promise.resolve(svg);
		}
	} else {
		if (svg.match(/^https?:\/\//)) {
			return util.get(svg);
		}
		return fs.readFile(svg);
	}
	throw new Error('unknowed handle type for string');
};

module.exports = util;
