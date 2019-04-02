### `Intro`
convert svg to png or jpg using canvas

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/svg.to.img.git
```


### `Example`

``` javascript
const convert = require('svg.to.img'),
	fs = require('fs.promisify');

convert('./test/1.svg', {width: 100, height: 100}).then((res) => {
	return fs.writeFile('1.png', res);
});
```