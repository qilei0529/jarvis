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


exports.format = function(str, data) {
	return str.replace(/\{(\w+)\}/g, function(r, m) {
		return data[m] !== undefined && data[m] !== null ? 
				data[m] : '{' + m + '}';
	});
};


var proxy = function() {};
exports.createObject = function(proto, o) {
	proxy.prototype = proto;
	var result = new proxy();
	return o ? exports.extend(result, o) : result;
}


exports.guard = function(fn) {
	var flag = false,
		result;
	return function() {
		if (flag) {
			return result;
		}
		flag = true;
		return result = fn.apply(this, arguments);
	};
};
