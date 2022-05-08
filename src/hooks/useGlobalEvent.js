// Module imports
import { useEffect } from 'react'





/**
 * Adds an event listener to a global.
 *
 * @param {object} options All options.
 * @param {string} options.event The name of the even to listen for, i.e. `click`.
 * @param {document | window} options.global Which global to attach this event to.
 * @param {boolean} [options.invokeImmediately = false] Whether or not to run the handler function immediately.
 * @param {Function} options.handler The function to be executed when the event is triggered.
 */
export function useGlobalEvent(options) {
	const {
		event,
		global,
		invokeImmediately = false,
		handler,
	} = options

	useEffect(() => {
		global.addEventListener(event, handler)

		if (invokeImmediately) {
			handler()
		}

		return () => global.removeEventListener(event, handler)
	}, [
		event,
		global,
		invokeImmediately,
		handler,
	])
}
