// Local imports
import { useGlobalEvent } from './useGlobalEvent.js'





/**
 * Adds an event listener to `document`.
 *
 * @param {object} options All options.
 * @param {string} options.event The name of the even to listen for, i.e. `click`.
 * @param {boolean} [options.invokeImmediately = false] Whether or not to run the handler function immediately.
 * @param {Function} options.handler The function to be executed when the event is triggered.
 */
export function useDocumentEvent(options) {
	useGlobalEvent({
		...options,
		global: document,
	})
}
