// Module imports
import { app } from 'electron'





export function handleAllWindowsClosed() {
	if (process.platform !== 'darwin') {
		app.quit()
	}
}
