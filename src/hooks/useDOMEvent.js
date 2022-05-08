// Module imports
import { useEffect } from 'react'





/**
 * Adds an event listener to a DOM element.
 *
 * @param {object} options All options.
 * @param {string} options.event The name of the even to listen for, i.e. `click`.
 * @param {import('react').RefObject} options.elementRef The ref of the element to attach this event to.
 * @param {Function} options.handler The function to be executed when the event is triggered.
 */
export function useDOMEvent(options) {
	const {
		event,
		elementRef,
		handler,
	} = options

	useEffect(() => {
		const element = elementRef.current

		if (element) {
			element.addEventListener(event, handler)
			return () => element.removeEventListener(event, handler)
		}
	}, [
		elementRef,
		event,
		handler,
	])
}
