exports.run = function(root, options) {
	if (!root) {
		return p(exports.doc());
	}
};


exports.desc = function() {
	return '编译一个应用';
};


exports.doc = function() {
	return 'useage: jarvis build <file|dir>';
};


function p() {
	console.log.apply(console, arguments);
};
