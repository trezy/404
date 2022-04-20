/* eslint-env node */

// Module imports
import { app } from 'electron'





/**
 * Quits the app when all windows have been closed.
 */
export function handleAllWindowsClosed() {
	if (process.platform !== 'darwin') {
		app.quit()
	}
}
