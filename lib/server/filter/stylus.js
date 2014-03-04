var Path = require('path'),
	fs = require('fs'),
	util = require('util'),
	utils = require('../utils');


var ERROR_TPL =  
[
'body:before {',
'	content: \'{0}\';',
'	font-size: 40px;',
'	color: #f00;',
'}'
].join('');


module.exports = function(req, res, next) {
	var root = req.config.root,
		path = req.url.replace(/\?.*$/, '');

	if (root && Path.extname(path) === '.css') {
		path = Path.join(Path.dirname(path), Path.basename(path, '.css') + '.styl');
		if (fs.existsSync(Path.join(root, path))) {
			utils.debug('styl file exist: ' + path);
			req.url = path.replace(/\\/g, '/');
		}
	}
	
	utils.filter(req, res, next, /\.styl$/, function(styl, fn) {
		process(req, res, styl, fn);
	});
};


function process(req, res, styl, fn) {
	opts = getOptions(req);

	var stylus = require('stylus');

	stylus.render(styl, opts, function(ex, css) {
		if (ex) {
			console.log(ex);
			css = getErrorOutput(ex, req);
		}
		
		res.setHeader('Content-Type', 'text/css');
		fn(null, css);
	});
}


function getOptions(req) {
	var root = req.config.root || '.',
		dir = Path.dirname(req.filepath);

	return utils.extend({
		paths: [dir, root],
		filename: req.filepath
	}, req.config.less);

}


function getErrorOutput(ex, req) {
	var css = 'Stylus Compile Error!!!:\n\n' + JSON.stringify(ex);
	return utils.format(ERROR_TPL, [css.replace(/'/g, '').replace(/\s/g, ' ')]);
}