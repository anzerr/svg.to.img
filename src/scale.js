
const ENUM = {
	END:  Buffer.from('>'),
	START: Buffer.from('<svg'),
	REG: /(.*?=)\s*(("|').*?("|'))/g
};

class Scale {

	constructor(content, w, h, ratio) {
		this.range = this.findTag(content);
		this.content = content;
		this.props = {width: w, height: h};
		this.header = content.slice(this.range[0], this.range[1])
			.toString()
			.replace(/\n/g, ' ')
			.replace(/\r/g, '');
		this.aspectRatio = this.findAspectRatio(ratio);
	}

	findTag(content) {
		let start = null;
		for (let i = 0; i < content.length; i++) {
			if (!start) {
				let found = 0;
				for (let x = 0; x < ENUM.START.length; x++) {
					if (content[i + x] === ENUM.START[x]) {
						found += 1;
					}
				}
				if (found === ENUM.START.length) {
					start = i + found;
				}
			} else {
				if (content[i] === ENUM.END[0]) {
					return [start, i];
				}
			}
		}
		throw new Error('found not find svg tag range');
	}

	findAspectRatio(ratio) {
		if (ratio) {
			if (typeof ratio === 'string') {
				return '"' + ratio + '"';
			}
			if (this.content.match(/\spreserveAspectRatio/)) {
				let quoChar = this.header.match(/\spreserveAspectRatio\s*=\s*(['"])/);
				if (quoChar) {
					quoChar = quoChar[1];
					let aspectRatio = this.header.match(new RegExp('\spreserveAspectRatio\\s*=\\s*' + quoChar + '([^' + quoChar + ']*)'));
					if (aspectRatio && aspectRatio[1]) {
						return aspectRatio[1].replace(/^\s*(\S.*\S)\s*$/, '"$1"');
					}
				}
			}
		}
	}

	getProps() {
		let match = ENUM.REG.exec(this.header),
			props = {};
		while (match !== null) {
			props[match[1].slice(0, -1).trim()] = match[2].slice(1, -1);
			match = ENUM.REG.exec(this.header);
		}
		props.width = props.width ? Number(props.width) : null;
		props.height = props.height ? Number(props.height) : null;
		return props;
	}

	toString() {
		let props = this.getProps(),
			size = {width: props.width, height: props.height};
		if (this.props.width) {
			props.width = this.props.width;
		}
		if (this.props.height) {
			props.height = this.props.height;
		}
		if (!props.viewBox) {
			props.viewBox = [
				0,
				0,
				size.width ? size.width : this.props.width,
				size.height ? size.height : this.props.height
			].join(' ');
		}
		props.preserveAspectRatio = this.aspectRatio || 'none';
		if (props.style) {
			props.style = props.style
				.replace(/(height:\s*)\d+?(px;)/g, '$1' + this.props.height + '$2')
				.replace(/(width:\s*)\d+?(px;)/g, '$1' + this.props.width + '$2');
		}

		let out = '<svg ';
		for (let p in props) {
			out += p + '="' + props[p] + '" ';
		}
		return this.content.slice(0, this.range[0] - ENUM.START.length) + out.trim() + '>' + this.content.slice(this.range[0] + ENUM.END.length, this.content.length);
	}

}

module.exports = (content, w, h, ratio) => {
	return new Scale(content, w, h, ratio)
		.toString();
};
