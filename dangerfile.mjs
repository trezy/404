// Module imports
import {
	danger,
	message,
} from 'danger'
import eslint from 'danger-plugin-eslint'





const modifiedMD = danger.git.modified_files.join('- ')

message(`Changed Files in this PR: \n - ${modifiedMD}`)

eslint()
