/* eslint-env node */

// Local imports
import { getContentManifest } from './getContentManifest.js'





/**
 * Retrieves metadata for all local content.
 *
 * @returns {boolean} A hash of local content metadata.
 */
export async function handleGetContentMeta() {
	return {
		maps: await getContentManifest('maps', '.debugmap'),
		tilesets: await getContentManifest('resourcepacks', '.debugresourcepack'),
	}
}
