var Path = require('path'),
	connect = require('connect');


module.exports = function(req, res, next) {
	var config = req.config;
	config.root ? 
		process(req, res, next, config) :
		next();
};


function process(req, res, next, config) {
	req.filepath = Path.join(config.root, req.url.replace(/\?.*$/, ''));
	req.fileext = Path.extname(req.filepath);
	res.setHeader('File-Path', req.filepath);

	var app = connect()
		.use(connect.directory(config.root))
		.use(connect.static(config.root));
	app(req, res, next);
}

