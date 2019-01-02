
const util = require('./src/util.js');

module.exports = (svg, options = {}) => {
	return util.load(svg).then((content) => {
		if (options.width || options.height) {
			content = util.scale(content, options.width, options.height, options.preserveAspectRatio);
		}
		let format = options.format || 'png',
			canvas = util.canvas(content),
			data = [],
			stream = (format === 'jpg' || format === 'jpeg') ? canvas.jpegStream({quality: options.quality}) : canvas.pngStream();
		return new Promise((resolve, reject) => {
			stream.on('data', (chunk) => {
				data.push(chunk);
			}).on('end', () => {
				resolve(Buffer.concat(data));
			}).on('error', (error) => {
				reject(error);
			});
		});
	});
};
