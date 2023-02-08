// Local imports
import { EventEmitter } from './EventEmitter.js'





// Constants
const fakeKeyState = {
	isActive: false,
	activatedAt: null,
}
Object.freeze(fakeKeyState)





export class Keyboard extends EventEmitter {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	handleKeyDown = event => this.#activateKey(event)

	handleKeyUp = event => this.#deactivateKey(event)





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#keyStates = {}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#activateKey(event) {
		const key = event.key.toLowerCase()

		if (!this.#keyStates[key]) {
			this.#keyStates[key] = {
				activatedAt: null,
				isActive: false,
			}
		}

		const keyState = this.#keyStates[key]

		if (keyState.isActive) {
			return
		}

		keyState.isActive = true
		keyState.activatedAt = performance.now()
	}

	#bindEventListeners() {
		window.addEventListener('keydown', this.handleKeyDown)
		window.addEventListener('keypress', this.handleKeyDown)
		window.addEventListener('keyup', this.handleKeyUp)
	}

	#deactivateKey(event) {
		const key = event.key.toLowerCase()
		const keyState = this.#keyStates[key]

		keyState.isActive = false
		keyState.activatedAt = null
	}

	#unbindEventListeners() {
		window.removeEventListener('keydown', this.handleKeyDown)
		window.removeEventListener('keypress', this.handleKeyDown)
		window.removeEventListener('keyup', this.handleKeyUp)
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	constructor() {
		super()
		this.#bindEventListeners()
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	destroy() {
		this.#unbindEventListeners()
	}

	getKey(key) {
		const keyState = this.#keyStates[key.toLowerCase()]

		if (!keyState) {
			return fakeKeyState
		}

		return keyState
	}
}
