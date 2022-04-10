// Constants
const BUTTON_HOLD_TIME = 200





/**
 * Manages a gamepad.
 */
export class Gamepad {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#gamepad = null

	#index = null

	#isConnected = true

	#mapping = null

	#name = null

	#productID = null

	#state = null

	#template = null

	#vendorID = null





	/****************************************************************************\
	 * Public instance properties
	\****************************************************************************/

	/**
	 * Updates the state of the axis to match the state of the gamepad's associated physical axis.
	 *
	 * @param {object} axisValue The value of the physical gamepad axis.
	 * @param {number} index The index of the axis.
	 */
	updateAxis = (axisValue, index) => {
		const previousAxisValue = this.#state.axes[index].value
		const { deadzone } = this.#mapping.axes[index]
		let processedAxisValue = Number(axisValue.toFixed(2))

		if (deadzone) {
			if ((processedAxisValue < 0) && (processedAxisValue > deadzone.minimum)) {
				processedAxisValue = 0
			} else if ((processedAxisValue > 0) && (processedAxisValue < deadzone.maximum)) {
				processedAxisValue = 0
			}
		}

		if (previousAxisValue !== processedAxisValue) {
			this.#state.axes[index] = { value: processedAxisValue }
			console.log({
				axis: index,
				previousValue: previousAxisValue,
				newValue: processedAxisValue,
			})
		}
	}

	/**
	 * Updates the state of the button to match the state of the gamepad's associated physical button.
	 *
	 * @param {object} button The state of the physical gamepad button.
	 * @param {number} index The index of the button.
	 */
	updateButton = (button, index) => {
		const now = performance.now()

		const previousButtonState = this.#state.buttons[index]

		/**
		 * @type {object}
		 * @property {boolean | number} isHeld Whether or not this button has been pressed longer than the minimum threshhold for being considered held.
		 * @property {boolean | number} isPressed Whether or not this button is currently pressed.
		 */
		const newButtonState = {
			isHeld: false,
			isPressed: false,
		}

		if (button.pressed) {
			newButtonState.isPressed = previousButtonState.isPressed || now

			if (previousButtonState.isPressed) {
				if (previousButtonState.isHeld) {
					newButtonState.isHeld = previousButtonState.isHeld
				} else if ((now - newButtonState.isPressed) >= BUTTON_HOLD_TIME) {
					newButtonState.isHeld = now
				}
			}
		}

		const isHeldHasChanged = newButtonState.isHeld !== previousButtonState.isHeld
		const isPressedHasChanged = newButtonState.isPressed !== previousButtonState.isPressed

		if (isPressedHasChanged || isHeldHasChanged) {
			this.#state.buttons[index] = newButtonState

			console.log({
				button: index,
				previousValue: previousButtonState,
				newValue: newButtonState,
			})
		}
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Gamepad.
	 *
	 * @param {object} gamepad The native gamepad object.
	 */
	constructor(gamepad) {
		if (/stadia controller/ui.test(gamepad.id)) {
			/* eslint-disable-next-line no-alert --
				Because Ian did terrible things that caused Clapton to tell me to. TBF, it's really Google's fault. 🤷🏻‍♂️
				I mean seriously, wtf? Why does this controller register FOUR FRIGGIN' CONTROLLERS?! WHAT ABOUT THAT MAKES SENSE?!
				Oh, I know why... Because of LITERALLY NO REASON SHUT UP GOOGLE YOU'RE DRUNK GO HOME.
			*/
			alert('STOP IT IAN.')
			throw new Error('I MEAN IT, IAN.')
		}

		this.#gamepad = gamepad
		this.#index = gamepad.index
		this.#isConnected = true

		this.parseID()
		this.initialiseState()
		this.getMapping()
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Marks the gamepad as disconnected from the system.
	 */
	disconnect() {
		this.#gamepad = null
		this.#isConnected = false
	}

	/**
	 * Retrieves the vendor and product IDs from the gamepad's ID string. These are used to retrieve the proper mappings for the controller.
	 */
	parseID() {
		const chromeRegex = /^(.*?) \((?:standard gamepad )?vendor: (\w+) product: (\w+)\)$/ui

		;([,
			this.#name,
			this.#vendorID,
			this.#productID,
		] = (chromeRegex.exec(this.#gamepad.id)) || [])
	}

	/**
	 * Ensures the gamepad can be used with the standard mapping.
	 */
	async getMapping() {
		try {
			const {
				mapping,
				name,
				template,
			} = await import(`./gamepadMappings/${this.#vendorID}/${this.#productID}.js`)

			this.#mapping = mapping
			this.#name = name

			const templateImage = new Image
			templateImage.src = `/gamepads/${template.name}.png`

			templateImage
				.decode()
				.then(() => {
					return this.#template = templateImage
				})
				.catch(() => {
					console.error(`Failed to load template image: ${template.name}`)
				})
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * Sets the initial state based on the capabilities of the physical gamepad.
	 */
	initialiseState() {
		this.#state = {
			axes: [],
			buttons: [],
		}

		this.#gamepad
			.axes
			.forEach(() => {
				this.#state.axes.push({ value: 0 })
			})

		this.#gamepad
			.buttons
			.forEach(() => {
				this.#state.buttons.push({
					isHeld: false,
					isPressed: false,
				})
			})
	}

	/**
	 * Updates the state of this `Gamepad` to match the state of the gamepad's physical controls.
	 */
	update() {
		this.#gamepad = navigator.getGamepads()[this.#index]

		if (!this.#gamepad) {
			this.#isConnected = false
			return
		}

		this.#gamepad.axes.forEach(this.updateAxis)
		this.#gamepad.buttons.forEach(this.updateButton)
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {boolean} Whether or not this gamepad uses the standard mapping.
	 */
	get id() {
		return this.#gamepad.id
	}

	/**
	 * @returns {boolean} Whether or not this gamepad is still connected.
	 */
	get isConnected() {
		return this.#isConnected
	}

	/**
	 * @returns {boolean} Whether or not this gamepad is ready to be used.
	 */
	get isReady() {
		return Boolean(this.#mapping && this.#template)
	}

	/**
	 * @returns {string} The human-friendly name of this gamepad.
	 */
	get name() {
		return this.#name
	}

	/**
	 * @returns {object} The current state of this gamepad.
	 */
	get state() {
		return this.#state
	}
}
