var Deferred = module.exports = function(deferFn) {
	var doneList = [],
		failList = [],
		progressList = [],
		
		doneArgs = null,
		failArgs = null,
		
		state = 'pending',
		isComplete = false;

	var complete = function(newState) {
		state = newState;
		isComplete = true;
		doneList.length = failList.length = progressList.length = 0;
	};


	var deferred = {
		state: function() {
			return state;	
		},

		done: function() {
			if (isComplete) {
				(state === 'resolved') && fire(arguments, doneArgs);
			} else {
				add(doneList, arguments);
			}
			return deferred;
		},

		fail: function() {
			if (isComplete) {
				(state === 'rejected') && fire(arguments, failArgs);
			} else {
				add(failList, arguments);
			}
			return deferred;
		},

		always: function() {
			deferred.done.apply(deferred, arguments);
			deferred.fail.apply(deferred, arguments);
			return deferred;
		},

		progress: function() {
			add(progressList, arguments);
			return deferred;
		},

		resolve: function() {
			if (!isComplete) {
				doneArgs = arguments;
				fire(doneList, doneArgs);
				complete('resolved');
			}
			return deferred;
		},

		reject: function() {
			if (!isComplete) {
				failArgs = arguments;
				fire(failList, failArgs);
				complete('rejected');
			}
			return deferred;
		},

		notify: function() {
			isComplete || fire(progressList, arguments);
			return deferred;
		},

		promise: function(obj) {
			return obj !== undefined && obj !== null ? 
					extend(obj, deferred) : deferred;
		},

		then: function(next) {
			return Deferred(function(promise) {
				deferred.done(function() {
					var result = next.apply(null, arguments);
					if (result && typeof result.promise === 'function') {
						result.pipe(promise);
					} else {
						promise.resolve(result);
					}
				});
				
				deferred.fail(promise.reject);
			});
		},

		pipe: function(defer) {
			return deferred.done(defer.resolve).fail(defer.reject);
		}
	};

	deferFn && deferFn.call(deferred, deferred);

	return deferred;
};


var add = function(list, args) {
	for (var i = 0, c = args.length; i < c; i++) {
		list.push(args[i]);
	}
};


var fire = function(list, args, context) {
	for (var i = 0, c = list.length; i < c; i++) {
		list[i].apply(context, args);
	}
};


var extend = function(des) {
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


var slice = [].slice;

Deferred.when = function() {
	var works = arguments[0];
	works = Array.isArray(works) ? works : arguments;

	var defer = Deferred(),
		length = works.length,
		count = 0,
		doneArgs = [],
		failArgs = [];

	if (length === 0) {
		return defer.resolve();
	}

	var doneFun = function(i) {
		return function() {
			doneArgs[i] = slice.call(arguments, 0);
			count++;
			if (count >= length) {
				defer.resolve.apply(defer, doneArgs);
			}
		};
	};

	var failFun = function(i) {
		return function() {
			failArgs[i] = slice.call(arguments, 0);
			defer.reject.apply(defer, failArgs);
		};
	};
	
	for (var i = 0, c = length; i < c; i++) {
		var work = works[i];
		work.done(doneFun(i));
		work.fail(failFun(i));
	}

	return defer;
};


Deferred.then = function() {
	var works = arguments[0];
	works = Array.isArray(works) ? works : arguments;

	var start = Deferred(),
		defer = start;

	for (var i = 0, c = works.length; i < c; i++) {
		defer = defer.then(works[i]);
	}

	start.resolve();

	return defer;
};
