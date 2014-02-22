module.exports = {
	port: 8888,
	root: '/Users/bencode/webroot',
	logger: 'dev',

	art: {
		paths: [
			'/Users/bencode/webroot/jarvis-art'
		]
	},

	hosts: {
		'www.jarvis.com': {
			root: '/Users/bencode/webroot/jarvis'
		}
	}
}
