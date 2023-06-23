/**
 * Represents a vector on a two dimensional plane.
 */
export class Vector2 {
	/****************************************************************************\
	 * Public static methods
	\****************************************************************************/

	/**
	 * Adds the values of two vectors.
	 *
	 * @param {Vector2} vectorA The first vector to be added.
	 * @param {Vector2} vectorB The second vector to be added.
	 * @returns {Vector2} A new Vector2 representing the result of the operation.
	 */
	static add(vectorA, vectorB) {
		if (!(vectorA instanceof Vector2) || !(vectorB instanceof Vector2)) {
			throw new TypeError('Cannot add non-vectors.')
		}

		return new Vector2(
			vectorA.x + vectorB.x,
			vectorA.y + vectorB.y,
		)
	}

	/**
	 * Compares two vectors to check if they're equivalent.
	 *
	 * @param {Vector2} vectorA The first vector to be compared.
	 * @param {Vector2} vectorB The second vector to be compared.
	 * @returns {boolean} Whether the vectors are equivalent.
	 */
	static areEqual(vectorA, vectorB) {
		if (!(vectorA instanceof Vector2) || !(vectorB instanceof Vector2)) {
			throw new TypeError('Cannot check equality of non-vectors.')
		}

		return vectorA.toString() === vectorB.toString()
	}

	/**
	 * Gets the distance between two vectors.
	 *
	 * @param {Vector2} vectorA The first vector to be compared.
	 * @param {Vector2} [vectorB] The second vector to be compared. Defaults to 0, 0.
	 * @returns {Vector2} A vector representing the relative distance between the input vectors.
	 */
	static magnitude(vectorA, vectorB = new Vector2(0, 0)) {
		if (!(vectorA instanceof Vector2) || !(vectorB instanceof Vector2)) {
			throw new TypeError('Cannot calculate magnitude for non-vectors.')
		}

		const x = vectorA.x - vectorB.x
		const y = vectorA.y - vectorB.y

		const x2 = x ** 2
		const y2 = y ** 2

		return Math.sqrt(x2 + y2)
	}

	/**
	 * Converts a string representation of a 2d vector to a proper Vector2.
	 */
	static fromString(coordinateString) {
		if (!/^-?\d+\|-?\d+$/.test(coordinateString)) {
			throw new TypeError('vector strings must conform to the format `x|y`')
		}

		return new Vector2(...coordinateString.split('|').map(Number))
	}

	/**
	 * Subtracts the values of two vectors.
	 *
	 * @param {Vector2} vectorA The first vector to be subtracted.
	 * @param {Vector2} vectorB The second vector to be subtracted.
	 * @returns {Vector2} A new Vector2 representing the result of the operation.
	 */
	static subtract(vectorA, vectorB) {
		if (!(vectorA instanceof Vector2) || !(vectorB instanceof Vector2)) {
			throw new TypeError('Cannot subtract non-vectors.')
		}

		return new Vector2(
			vectorA.x - vectorB.x,
			vectorA.y - vectorB.y,
		)
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	/** @type {number} */
	#x

	/** @type {number} */
	#y





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new 2d vector.
	 *
	 * @param {number} x The x coordinate of the vector.
	 * @param {number} y The y coordinate of the vector.
	 */
	constructor(x, y) {
		this.#x = x
		this.#y = y
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Generates a string representation of the vector coordinates.
	 *
	 * @returns {string} A string representation of the vector coordinates.
	 */
	toString() {
		return `${this.#x}|${this.#y}`
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	get x() {
		return this.#x
	}

	set x(value) {
		if (typeof value !== 'number') {
			throw new TypeError('Vector2\'s `x` value must be a number')
		}
		this.#x = value
	}

	get y() {
		return this.#y
	}

	set y(value) {
		if (typeof value !== 'number') {
			throw new TypeError('Vector2\'s `y` value must be a number')
		}
		this.#y = value
	}
}
