exports.extend = function(des /*, src1, src2, ... */) {
	var objs = [].slice.call(arguments, 1);

	objs.forEach(function(obj) {
		if (obj) {
			for (var k in obj) {
				var v = obj[k];
				if (v !== undefined && v !== null) {
					des[k] = v;
				}
			}
		}
	});

	return des;
};


exports.isDebug = process.argv.indexOf('-d') !== -1 || 
		process.argv.indexOf('--debug') !== -1;

exports.debug = function() {
	exports.isDebug && console.log.apply(console, arguments);
}
