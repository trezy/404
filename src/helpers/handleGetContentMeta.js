/* eslint-env node */

// Local imports
import { getAllContentManifests } from './getAllContentManifests.js'





/**
 * Retrieves metadata for all local content.
 *
 * @returns {boolean} A hash of local content metadata.
 */
export function handleGetContentMeta() {
	return getAllContentManifests()
}
