/**
 * Executes a promise, preventing resolution until after the minimum duration has passed.
 *
 * @param {Promise} promise The promise to be executed.
 * @param {number} minimumDuration The minimum duration of the promise.
 */
export function executePromiseWithMinimumDuration(promise, minimumDuration) {
	const startedAt = performance.now()

	return new Promise(resolve => {
		if (typeof promise === 'function') {
			promise = promise()
		}

		// eslint-disable-next-line promise/catch-or-return
		promise.then(() => {
			const remainingDuration = minimumDuration - (performance.now() - startedAt)

			// eslint-disable-next-line promise/always-return
			if (remainingDuration) {
				setTimeout(() => {
					resolve()
				}, remainingDuration)
			} else {
				resolve()
			}
		})
	})
}
