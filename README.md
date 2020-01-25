
### `Intro`
![GitHub Actions status | publish](https://github.com/anzerr/svg.to.img/workflows/publish/badge.svg)

convert svg to png or jpg using canvas

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/svg.to.img.git
npm install --save @anzerr/svg.to.img
```

### `Example`
``` javascript
const convert = require('svg.to.img'),
	fs = require('fs.promisify');

convert('./test/1.svg', {width: 100, height: 100}).then((res) => {
	return fs.writeFile('1.png', res);
});
```