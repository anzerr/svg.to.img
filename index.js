
const util = require('./src/util.js');

module.exports = (svg, options = {}) => {
	return util.load(svg).then((content) => {
		if (options.width || options.height) {
			content = util.scale(content, options.width, options.height, options.preserveAspectRatio);
		}
		return util.canvas(content, options.width, options.height).then((canvas) => {
			return canvas.toBuffer();
		});
	});
};
