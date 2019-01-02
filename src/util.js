
const canvg = require('canvg'),
	Canvas = require('canvas'),
	http = require('http'),
	fs = require('fs.promisify'),
	scale = require('./scale.js'),
	https = require('https');

const util = {

	scale: scale,

	canvas: (svgContent) => {
		let canvas = Canvas.createCanvas();
		canvg(canvas, svgContent, {ignoreMouse: true, ignoreAnimation: true, ImageClass: Canvas.Image});
		return canvas;
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
