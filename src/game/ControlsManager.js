// Local imports
import { ACTIONS } from '../controls/ACTIONS.js'
import { Gamepad } from './Gamepad.js'
import { Keyboard } from './Keyboard.js'





/**
 * Manages control surfaces, including mouse/keyboard and gamepads.
 */
export class ControlsManager {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

 	#actionCaches = new Map

	#gamepads = {
		0: null,
		1: null,
		2: null,
		3: null,
	}

	#keyboard = new Keyboard





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
	 * Returns the keyboard.
	 *
	 * @returns {Keyboard} The keyboard.
	 */
	getKeyboard() {
		return this.#keyboard
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
		const now = performance.now()

		Object
			.values(this.#gamepads)
			.forEach(gamepad => {
				if (gamepad === null) {
					return
				}

				gamepad.update()
			})

		ACTIONS.forEach(action => {
			const {
				bindings,
				handler,
				repeatFrequency,
			} = action

			if (bindings.keyboard) {
				const keyState = this.#keyboard.getKey(bindings.keyboard)

				if (keyState.isActive) {
					let actionCache = this.#actionCaches.get(keyState)

					if (!actionCache) {
						actionCache = { triggeredAt: now }
						this.#actionCaches.set(keyState, actionCache)
						handler()
					} else if ((now - actionCache.triggeredAt) >= repeatFrequency) {
						actionCache.triggeredAt = now
						handler()
					}
				} else {
					this.#actionCaches.delete(keyState)
				}
			}
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
