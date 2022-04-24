// Module imports
import {
	useCallback,
	useEffect,
} from 'react'





/**
 * Execute a callback when a click is detected outside of an element.
 *
 * @param {import('react').RefObject} targetRef A reference to the element within which clicks will not trigger the callback.
 * @param {Function} callback The function to be called when a click is detected outside of the target element.
 * @returns {object} Stuff.
 */
export function useForeignInteractionHandler(targetRef, callback) {
	const handleForeignInteraction = useCallback(event => {
		const currentElement = targetRef.current

		if ((currentElement !== event.target) && !currentElement.contains(event.target)) {
			callback(event)
		}
	}, [
		callback,
		targetRef,
	])

	useEffect(() => {
		document.addEventListener('click', handleForeignInteraction)

		return () => document.removeEventListener('click', handleForeignInteraction)
	}, [handleForeignInteraction])

	return {
		handleForeignInteraction,
	}
}
