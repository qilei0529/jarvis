exports.__proto__ = require('../util/utils');


exports.filter = function(req, res, next, test, filter) {
	var oriTest = test;
	test = typeof test === 'function' ? test : 
			function(req) { return oriTest.test(req.url.replace(/\?.*/, '')) };

	if (!test(req)) {
		return next();
	}

	delete req.headers['if-none-match'];
	delete req.headers['if-modified-since'];

	var write = res.write,
		end = res.end,
		list = [];

	res.write = function(chunk) {
		list.push(chunk);
	};

	res.end = function(chunk) {
		res.write = write;
		res.end = end;

		chunk && list.push(chunk);

		if (!list.length) {
			return res.end();
		}

		doFilter(req, res, next, 
				Buffer.concat(list).toString(), filter);
	};

	next();
}

function doFilter(req, res, next, body, filter) {
	var complete = function(output) {
		output = output === false ? body : output;
		var buf = new Buffer(output);
		res.setHeader('Content-Length', buf.length);
		res.write(buf);
		res.end();
	};

	if (filter.length >= 2) {
		filter(body, function(e, output) {
			if (e) {
				return next(e);
			}
			complete(output);
		});
	} else {
		complete(filter(body));
	}	
}
