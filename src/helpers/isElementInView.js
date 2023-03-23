/**
 * Determines whether or not an element is currently visible within the viewport.
 *
 * @param {*} element The element to check for visibility.
 * @returns {boolean} Whether or not the element is visible.
 */
export function isElementInView(element) {
	if (!element) {
		return true
	}

	const bounding = element.getBoundingClientRect()

	if (bounding.top < 0) {
		return false
	}

	if (bounding.left < 0) {
		return false
	}

	if (bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
		return false
	}

	if (bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
		return false
	}

	return true
}
