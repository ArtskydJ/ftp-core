var test = require('tape')
var validator = require('ftp-validate-response')
var FTP = require('../')
var FtpNlst = require('../extension/nlst')

// Based on RFC 959, see:
// https://tools.ietf.org/html/rfc959#page-5
// https://tools.ietf.org/html/rfc959#page-33

var pathnames = [ // whatever the other file system supports
	'/',
	'/hello',
	'/goodbye/cruel world',
	'..' // not sure about this one!
]

pathnames.forEach(function(pathname) {
	test('Testing for valid NLST response with pathname: ' + pathname, function(t) {
		// t.plan(4)
		var testFTP = new FTP().extend(FtpNlst())

		testFTP.callCommand('NLST', pathname).then(function(output) {
			t.ok(validator(output), 'response should be valid')
			t.ok(/^(\d{3})[ -].+\r\n/.test(output), 'the response code is three digits followed by a space or hyphen, ending with <CRLF>')

			var validResponseCodes = [ 125, 150, 226, 250, 421, 425, 426, 450, 451, 500, 501, 502, 530 ] // https://tools.ietf.org/html/rfc959#page-52
			var code = parseInt(output, 10)
			t.notEqual(validResponseCodes.indexOf(code), -1, 'RFC 959 expects one of these server response codes')

			if (code === 250) {
				t.equal(testFTP.core.currentDirectory(), pathname, '250 response means the listing was successful')
			} else {
				t.notEqual(testFTP.core.currentDirectory(), pathname, 'any response other than 250 means the listing was unsuccessful')
			}

			t.end()
		})
	})
})
