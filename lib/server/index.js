var connect = require('connect'),
	util = require('util'),
	utils = require('../util/utils');


module.exports = function(config) {
	var app = connect();	

	config.logger && app.use(connect.logger(config.logger));
	app.use(connect.query());

	if (config.root) {
		app.use(connect.static(config.root))
			.use(connect.directory(config.root));
	}

	app.use(function(req, res, next) {
		req.config = getHostConfig(req, config);
		utils.debug('host config:', req.config);
		next();	
	});

	var filters = config.filters || require('./filters');
	utils.debug('filters:', filters);

	filters.forEach(function(name) {
		var filter = require('./filter/' + name);
		filter.name = filter.name || name;
		app.use(filter);
	});

	app.run = function() {
		util.log('start server: ' + config.port);
		app.listen(config.port);
		app.on('error', util.error);
	};

	return app;
};


function getHostConfig(req, config) {
	var o = utils.extend({}, config);
	delete o.hosts;

	var hosts = config.hosts || {},
		parts = req.headers.host.split(':'),
		host = parts[0],
		port = parts[1] || '';

	o.host = host;
	o.port = port;

	return utils.extend(o, hosts[host]);
};
