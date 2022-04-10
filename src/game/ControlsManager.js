// Local imports
import { Gamepad } from './Gamepad.js'





/**
 * Manages control surfaces, including mouse/keyboard and gamepads.
 */
export class ControlsManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#gamepads = {
		0: null,
		1: null,
		2: null,
		3: null,
	}





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	/**
	 * Handles a gamepad being connected to the device.
	 *
	 * @param {object} event The `gamepadconnected` event.
	 */
	handleGamepadConnected = event => {
		const { gamepad } = event

		this.#gamepads[gamepad.index] = new Gamepad(gamepad)
	}

	/**
	 * Handles a gamepad being disconnected from the device.
	 *
	 * @param {object} event The `gamepaddisconnected` event.
	 */
	handleGamepadDisconnected = event => {
		const { gamepad } = event

		this.#gamepads[gamepad.index].disconnect()
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Create a new controls manager.
	 */
	constructor() {
		this.initialiseEventListeners()
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Returns the gamepad at the specified index.
	 *
	 * @param {number} [gamepadIndex] The index of the requested gamepad.
	 * @returns {object} The gamepad at the requested index.
	 */
	getGamepad(gamepadIndex) {
		if (typeof gamepadIndex === 'undefined') {
			return Object
				.values(this.#gamepads)
				.filter(gamepad => gamepad !== null)[0]
		}

		return this.#gamepads[gamepadIndex]
	}

	/**
	 * Attach all event listeners.
	 */
	initialiseEventListeners() {
		window.addEventListener('gamepadconnected', this.handleGamepadConnected)
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected)
	}

	/**
	 * Updates the state of all controllers.
	 */
	update() {
		Object
			.values(this.#gamepads)
			.forEach(gamepad => {
				if (gamepad === null) {
					return
				}

				gamepad.update()
			})
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {object} The number of currently tracked gamepads.
	 */
	get gamepadCount() {
		return Object
			.values(this.#gamepads)
			.filter(gamepad => gamepad !== null)
			.length
	}

	/**
	 * @returns {object} An object containing all currently tracked gamepads.
	 */
	get gamepads() {
		return this.#gamepads
	}
}
