/* eslint-env node */

// Local imports
import { getContentManifest } from './getContentManifest.js'





/**
 * Retrieves metadata for all local content.
 *
 * @returns {boolean} A hash of local content metadata.
 */
export async function getAllContentManifests() {
	return {
		maps: await getContentManifest('maps', '.debugmap'),
		resourcepacks: await getContentManifest('resourcepacks', '.debugresourcepack'),
	}
}
