/**
 * Capitalises the first letter of a string.
 *
 * @param {string} input The string to be capitalised.
 * @returns {string} The capitalised string.
 */
export function capitalise(input) {
	const [firstCharacter, ...string] = input.split('')

	return `${firstCharacter.toUpperCase()}${string.join('')}`
}
