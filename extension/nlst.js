var generate = require('ftp-generate-response')
var path = require('path')
var fs = require('fs')

module.exports = function FtpExtendNlst(rootPath) {
	rootPath = rootPath || __dirname
	var cwd = '/'
	return {
		commands: {
			NLST: function(core, pathname, cb) {
				var newPath = path.join(rootPath, pathname)
				fs.readdir(newPath, function (err, list) {
					if (err) {
						cb(null, '450 Requested file action not taken.\r\n')
					} else {
						cwd = pathname
						var lines = [ 'Requested file action okay, completed.' ].concat(list, 'End')
						cb(null, generate(250, lines))
					}
				})
			}
		},
		core: {
			currentDirectory: function() {
				return cwd
			}
		}
	}
}
