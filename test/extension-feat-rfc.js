var test = require('tape')
var validator = require('ftp-validate-response')
var FTP = require('../')
var FtpFeat = require('../extension/feat')
var FtpUser = require('../extension/user')
var getListFromResponse = require('./helpers/get-list-from-response')

// Based on RFC 959 and RFC 5797

var commandsRequiredInAllFeatResponses = [
	'UTF8'
]

test('FEAT command response is valid', function(t) {
	var testFTP = new FTP().extend(FtpFeat()).extend(FtpUser())

	testFTP.callCommand('FEAT').then(function(output) {
		t.ok(validator(output), 'response should be valid')

		var parsed = /^(\d{3}) (.+)\r\n/.exec(output)
		var number = parseInt(parsed[1], 10)
		var validResponseCodes = [ 230, 530 ]
		t.notEqual(validResponseCodes.indexOf(number), -1, 'RFC 959/5797 expects one of these server response codes')

		if (number === 230) {
			var commands = getListFromResponse(output)
			var requiredCommandsAreInResponse = commandsRequiredInAllFeatResponses.every(function(command) {
				return commands.any(function(responseCommand) {
					return responseCommand.indexOf(command) === 0
				})
			})
			t.ok(requiredCommandsAreInResponse, 'all required commands exist in the response')
		}
		t.end()
	})
})
