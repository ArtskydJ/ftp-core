module.exports = function getList(string) {
	var lines = string.split('\r\n')
	// the first and last lines are ignored
	// TODO: check if this is an RFC spec, because everybody does it
	return lines.slice(1, -1).map(function(line) {
		// Although not required in any RFC I have read, most implementations
		// insert whitespace before the command.
		return line.trim()
	})
}
