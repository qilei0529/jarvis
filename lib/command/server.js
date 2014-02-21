var Path = require('path'),
	fs = require('fs'),
	utils = require('../util/utils');


exports.run = function(path, options) {
	path = Path.normalize(path || Path.join(__dirname, '../../config.js'));

	delete require.cache[path];
	var config = require(path);
	config = prepareConfig(config, options);

	utils.debug('create server with config:', config);
	
	var Server = require('../server'),
		server = new Server(config);

	server.run();
};


function prepareConfig(config, options) {
	config = utils.extend(config, options);
	config.port = config.port || 8888;
	return config;
}


exports.desc = function() {
	return '运行jarvis server进行开发';
}


exports.doc = function() {

	return [
'useage: jarvis server [config] [-p 80]',
'  - config    配置文件路径, 默认使用config.js',
'  - p         服务器启动的端口号，默认为80',
].join('\n');

};
