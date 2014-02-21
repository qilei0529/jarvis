exports.run = function(root, options) {

};


exports.desc = function() {
	return '运行jarvis server进行开发';
}


exports.doc = function() {

	return [
'useage: jarvis server [config]',
'  - config    配置文件, 如果为空，使用当前目录下的jarvis.js文件'
].join('\n');

};
