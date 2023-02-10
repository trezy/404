// Local imports
import { updateTimer } from '../newStore/helpers/updateTimer.js'





export class Timer {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#delta = null

	#gracePeriod = null

	#gracePeriodSkippedAt = null

	#now = null

	#startedAt = null





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	skipGracePeriod() {
		this.#gracePeriodSkippedAt = this.now
	}

	start(gracePeriod) {
		if (gracePeriod) {
			this.#gracePeriod = gracePeriod
		} else {
			this.#gracePeriod = null
		}

		this.#gracePeriodSkippedAt = null
		this.#startedAt = this.now
	}

	stop() {
		this.#gracePeriod = null
		this.#startedAt = null
		updateTimer('00:00')
	}

	toString() {
		if (this.isInGracePeriod) {
			const graceDelta = this.#gracePeriod - this.delta
			const graceDeltaInSeconds = graceDelta / 1000

			const minutes = Math.floor(graceDeltaInSeconds / 60)
			const seconds = Math.ceil(graceDeltaInSeconds % 60)

			return `-${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		} else {
			let delta = this.delta - this.#gracePeriod

			if (this.#gracePeriodSkippedAt) {
				delta = this.delta - (this.#gracePeriodSkippedAt - this.#startedAt)
			}

			const deltaInSeconds = delta / 1000

			const minutes = Math.floor(deltaInSeconds / 60)
			const seconds = Math.floor(deltaInSeconds % 60)

			const minutesString = String(minutes).padStart(2, '0')
			const secondsString = String(seconds).padStart(2, '0')

			return `${minutesString}:${secondsString}`
		}
	}

	update() {
		this.#delta = null
		this.#now = null

		updateTimer(this.toString())
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	get delta() {
		if (!this.#delta) {
			this.#delta = this.now - this.#startedAt
		}

		return this.#delta
	}

	get isInGracePeriod() {
		if (this.#gracePeriodSkippedAt) {
			return false
		}

		return this.delta < this.#gracePeriod
	}

	get now() {
		if (!this.#now) {
			this.#now = performance.now()
		}

		return this.#now
	}
}
