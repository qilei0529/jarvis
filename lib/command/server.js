exports.run = function(root, options) {

};


exports.desc = function() {
	return '运行jarvis server进行开发';
}


exports.doc = function() {

	return [
'useage: jarvis server [config] [-p 80]',
'  - config    配置文件路径, 如果为空，使用当前目录下的jarvis.js文件',
'  - p         服务器启动的端口号，默认为80',
].join('\n');

};
