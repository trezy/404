// Module imports
const {
	danger,
	message,
} = require('danger')
const eslint = require('danger-plugin-eslint')





const modifiedMD = danger.git.modified_files.join('- ')

message(`Changed Files in this PR: \n - ${modifiedMD}`)

eslint()
