var Path = require('path'),
	fs = require('fs'),
	utils = require('../utils');


module.exports = function(req, res, next) {
	utils.filter(req, res, next, /\.html?$/, function(art, fn) {
		process(req, res, art, fn);
	});
};


function process(req, res, art, fn) {
	var context = createContext(req);
	render(art, context, function(e, html) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Javis-ArtTemplate', '1');
		fn(e, html);
	});
}

function render(art, context, fn) {
	var template = require('art-template'),
		flag = false;

	var afn = function() {
		if (flag) {
			return;
		}
		flag = true;
		return fn.apply(this, arguments);
	};

	template.onerror = function (e) {
		var message = 'Template Error\n\n';
		for (var name in e) {
			message += '<' + name + '>\n' + e[name] + '\n\n';
		}
		afn(null, message);
	};
	
	try {	
		var render = template.compile(art);
		var html = render(context);
		afn(null, html);
	} catch (e) {
		afn(e);
	}
		
}


function createContext(req, cxt) {
	cxt = cxt ? utils.createObject(cxt) : {};
	cxt.$data = cxt;
	cxt.$ = {
		data: function(path) {
			utils.extend(cxt, readData(req, path));
			return '';
		},

		render: function(path, data) {
			return path;
		}
	};
	return cxt;
}


function readData(req, path) {
	var resolved = resolve(req, path + '.js');
	if (!resolved) {
		throw new Error('can not resolve data:' + path);
	}
	delete require.cache[resolved];
	var dataProto = require(resolved);
	return typeof dataProto === 'function' ? dataProto(req) : dataProto;
}


function resolve(req, path) {
	var result = null,
		curDir = Path.dirname(req.filepath);
	if (/^\./.test(path)) {
		result = Path.join(curDir, path);
		return fs.existsSync(result) ? result : null;
	}

	var config = req.config.art || {},
		paths = config.paths || {};
	paths.unshift(curDir);

	for (var i = 0, c = paths.length; i < c; i++) {
		result = Path.join(paths[i], path);
		if (fs.existsSync(result)) {
			return result;
		}
	}
}

