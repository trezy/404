// Module imports
import { store } from '../store.js'





/**
 * Change settings panel.
 *
 * @param {'accessibility' | 'controls' | 'graphics' | 'sound'} panelName The name of the panel to change to.
 */
export function goToSettingsPanel(panelName) {
	store.set(() => ({ currentSettingsPanel: panelName }))
}
