var Path = require('path'),
	fs = require('fs'),
	utils = require('../utils'),
	Deferred = require('../../util/deferred');


module.exports = function(req, res, next) {
	utils.filter(req, res, next, /\.html?$/, function(art, fn) {
		process(req, res, art, fn);
	});
};


function process(req, res, art, fn) {
	var config = req.config.art || {},
		context = createContext(req, Path.dirname(req.filepath));

	render(art, context, function(e, html) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Javis-ArtTemplate', '1');
		fn(e, html);
	});
}

function render(art, context, fn) {
	var template = require('art-template'),
	fn = utils.guard(fn);

	template.onerror = function (e) {
		var message = 'Template Error\n\n';
		for (var name in e) {
			message += '<' + name + '>\n' + e[name] + '\n\n';
		}
		fn(null, message);
	};
	
	var render = template.compile(art),
		html = render(context);
	
	Deferred.when(context.$depends).done(function() {
		var args = arguments;
		html = html.replace(rPlaceHolder, function(all, index) {
			return (args[+index] || [])[1] || 'Render View Error!';
		});
		fn(null, html);
	});
}


function createContext(req, dir, viewdata) {
	cxt = {};
	viewdata && utils.extend(cxt, viewdata);

	var proto = cxt.__proto__ = {};
	cxt.$depends = [],
	cxt.$data = cxt;
	cxt.$template = {
		data: function(path) {
			utils.extend(proto, readData(req, dir, path));
			return '';
		},

		view: function(path, data) {
			var ph = sPlaceHolder + cxt.$depends.length;
			renderView(req, dir, cxt.$depends, path, data);
			return ph;
		}
	};
	return cxt;
}


function readData(req, dir, path) {
	var resolved = resolve(req, dir, path + '.js');
	if (!resolved) {
		throw new Error('can not resolve data:' + path);
	}
	delete require.cache[resolved];
	var dataProto = require(resolved);
	return typeof dataProto === 'function' ? dataProto(req) : dataProto;
}


function resolve(req, dir, path) {
	var result = null;
	if (/^\./.test(path)) {
		result = Path.join(dir, path);
		return fs.existsSync(result) ? result : null;
	}

	var config = req.config.art || {},
		paths = config.paths.slice(0) || [];
	paths.unshift(dir);

	for (var i = 0, c = paths.length; i < c; i++) {
		result = Path.join(paths[i], path);
		if (fs.existsSync(result)) {
			return result;
		}
	}
}


var sPlaceHolder = '##PLACE_HOLDER_' + new Date().getTime() + '_',
	rPlaceHolder = new RegExp(sPlaceHolder + '(\\d+)', 'g');


function renderView(req, dir, depends, path, data) {
	var viewPath = resolve(req, dir, path + '.html');
	if (!viewPath) {
		throw new Error('can not resolve view:' + path);
	}

	var defer = Deferred();

	fs.readFile(viewPath, 'utf-8', function(e, art) {
		if (e) {
			return defer.resolve(e);
		}

		var cxt = createContext(req, Path.dirname(viewPath), data);
		render(art, cxt, function(e, html) {
			defer.resolve(e, html);
		});
	});

	depends.push(defer);
}
