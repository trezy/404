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

	handleKeyDown = event => {
		if (event.isTrusted) {
			this.#activateKey(event)
		}
	}

	handleKeyUp = event => {
		if (event.isTrusted) {
			this.#deactivateKey(event)
		}
	}





	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#keyStates = {}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#activateKey(event) {
		const { code } = event

		if (!this.#keyStates[code]) {
			this.#keyStates[code] = {
				activatedAt: null,
				code,
				isActive: false,
			}
		}

		const keyState = this.#keyStates[code]

		if (keyState.isActive) {
			return
		}

		keyState.isActive = true
		keyState.activatedAt = performance.now()
		this.emit('key activated', keyState)
	}

	#bindEventListeners() {
		window.addEventListener('keydown', this.handleKeyDown)
		window.addEventListener('keypress', this.handleKeyDown)
		window.addEventListener('keyup', this.handleKeyUp)
	}

	#deactivateKey(event) {
		const { code } = event

		const keyState = this.#keyStates[code]

		keyState.isActive = false
		keyState.activatedAt = null
		this.emit('key deactivated', keyState)
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

	getKey(code) {
		const keyState = this.#keyStates[code]

		if (!keyState) {
			return {
				...fakeKeyState,
				code,
			}
		}

		return keyState
	}
}
