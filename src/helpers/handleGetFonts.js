/* eslint-env node */

// Module imports
import LocalFontsManager from 'local-fonts-manager'





/**
 * Retrieves a list of fonts installed on this system and returns it to the renderer.
 *
 * @returns {string[]} The list of fonts installed on the system.
 */
export function handleGetFonts() {
	const fonts = LocalFontsManager
		.getFontsMetadata()
		.reduce((accumulator, fontMeta) => {
			accumulator.add(fontMeta.family)
			return accumulator
		}, new Set)

	return Array.from(fonts)
}
