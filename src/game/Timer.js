// Local imports
import { updateTimer } from '../newStore/helpers/updateTimer.js'





export class Timer {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#delta = null

	#gracePeriod = null

	#startedAt = null





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	start(gracePeriod) {
		if (gracePeriod) {
			this.#gracePeriod = gracePeriod
		} else {
			this.#gracePeriod = null
		}

		this.#startedAt = performance.now()
	}

	stop() {
		this.#gracePeriod = null
		this.#startedAt = null
		updateTimer('00:00')
	}

	toString() {
		if (this.delta < this.#gracePeriod) {
			const minutes = Math.floor((this.#gracePeriod - this.delta) / 1000 / 60)
			const seconds = Math.ceil(((this.#gracePeriod - this.delta) / 1000) % 60)

			return `-${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		} else {
			const minutes = Math.floor((this.delta - this.#gracePeriod) / 1000 / 60)
			const seconds = Math.floor(((this.delta - this.#gracePeriod) / 1000) % 60)

			const minutesString = String(minutes).padStart(2, '0')
			const secondsString = String(seconds).padStart(2, '0')

			return `${minutesString}:${secondsString}`
		}
	}

	update() {
		this.#delta = null
		updateTimer(this.toString())
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	get delta() {
		if (!this.#delta) {
			this.#delta = performance.now() - this.#startedAt
		}

		return this.#delta
	}

	get isInGracePeriod() {
		return this.delta < this.#gracePeriod
	}
}
