// Module imports
import { useEffect } from 'react'





/**
 * Boilerplate for `requestAnimationFrame` hooks.
 *
 * @param {Function} callback The function to be called during the `requestAnimationFrame` loop.
 * @param {Array} dependencies
 */
export function useRequestAnimationFrame(callback, dependencies = []) {
	useEffect(() => {
		let shouldContinue = true

		/* eslint-disable-next-line jsdoc/require-jsdoc */
		const loop = () => {
			if (!shouldContinue) {
				return
			}

			callback()

			requestAnimationFrame(loop)
		}

		loop()

		return () => {
			shouldContinue = false
		}
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		...dependencies,
		callback,
	])
}
