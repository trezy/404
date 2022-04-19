/** @typedef {'dark grey' | 'green' | 'hazard' | 'grey' | 'orange' | 'red'} TileSpriteColor */
/** @typedef {'empty' | 'floor' | 'wall'} TileSpriteType */
/**
 * @typedef {object} TileSpriteConfig
 * @property {TileSpriteColor} [color] The color of the tile (floor tiles only).
 * @property {TileSpriteType} type The type of the tile.
 */





/**
 * An individual tile's sprite.
 */
export class TileSprite {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#color = null

	#type = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * @param {TileSpriteConfig} config Configuration for this tile sprite.
	 */
	constructor(config) {
		if (!this.#validateConfig(config)) {
			throw new Error('Attempted to create new `TileSprite` with invalid configuration.')
		}

		this.#type = config.type

		if (config.color) {
			this.#color = config.color
		}
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Validates a configuration object.
	 *
	 * @param {TileSpriteConfig} config The configuration object to be validated.
	 * @returns {boolean} Whether or not the configuration object is valid.
	 */
	#validateConfig(config) {
		if (!config.type) {
			return false
		}

		if ((config.type === 'wall') && config.color) {
			return false
		}

		return true
	}




	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {TileSpriteColor} The color of this tile.
	 */
	get color() {
		return this.#color
	}

	/**
	 * @returns {boolean} Whether or not this tile is traversable.
	 */
	get isTraversable() {
		return [
			'exit',
			'floor',
		].includes(this.#type)
	}

	/**
	 * @returns {TileSpriteType} The type of this tile.
	 */
	get type() {
		return this.#type
	}
}
