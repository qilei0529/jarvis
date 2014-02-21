exports.run = function(command) {
	if (!command) {
		return p(exports.doc());
	}

	try {
		var o = require('./' + command);
		p(o.doc ? o.doc() : '该命令没有文档矣~');
	} catch (e) {
		p('不支持此命令: ' + command);
	}
};


exports.desc = function() {
	return '查看命令帮助';
};


exports.doc = function() {
	return 'useage: jarvis help <command>';
};


function p(msg) {
	console.log(msg);
}
