/**
 * Converts a duration (in milliseconds) to a string in the form of `minutes:seconds.milliseconds`. All values are a minimum of 2 characters.
 *
 * @param {number} milliseconds A duration (in milliseconds) to be converted.
 * @returns {string} A stopwatch string representing the provided duration.
 */
export function convertMillisecondsToStopwatchString(milliseconds) {
	const minutes = Math.floor(milliseconds / 1000 / 60)
	const seconds = String(Math.floor(milliseconds / 1000 % 60)).padStart(2, '0')
	const fractionalSeconds = String(milliseconds % 1000).padStart(3, '0').slice(0, 2)

	return `${minutes}:${seconds}.${fractionalSeconds}`
}
