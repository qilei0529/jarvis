/**
 * less支持
 */

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
		path = Path.join(Path.dirname(path), Path.basename(path, '.css') + '.less');
		if (fs.existsSync(Path.join(root, path))) {
			utils.debug('less file exist: ' + path);
			req.url = path.replace(/\\/g, '/');
		}
	}
	
	utils.filter(req, res, next, /\.less(\?.*)?$/, function(less, fn) {
		res.setHeader('Content-Type', 'text/css');
		process(req, less, function(css) {
			fn(null, css);
		});
	});
};


function process(req, less, fn) {
		opts = getOptions(req),
		Parser = require('less').Parser,
		parser = new Parser(opts);

	parser.parse(less, function(ex, tree) {
		var css = '';
		if (!ex) {
			try {
				css = tree.toCSS();
			} catch (e) {
				ex = e;
			}
		}

		if (ex) {
			util.error(ex.message);
			css = getErrorOutput(ex, req);
		}

		fn(css);
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
	var css = 'Less Compile Error!!!:\n\n' + JSON.stringify(ex);
	return utils.format(ERROR_TPL, [css.replace(/'/g, '').replace(/\s/g, ' ')]);
}
