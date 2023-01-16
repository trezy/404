// Module imports
import { useEffect } from 'react'





// Local imports
import { configStore } from '../helpers/configStore.js'





/**
 * Handles changes to the colorblindType setting.
 *
 * @param {string} value The new value of the colorblindType setting.
 */
function handleColorblindTypeChange(value) {
	// const rootClasses = document.documentElement.classList.entries()

	// let rootClass = rootClasses.next()

	// while (!rootClass.done) {
	// 	const [, classString] = rootClass.value

	// 	if (classString.startsWith('colorblind-type')) {
	// 		document.documentElement.classList.remove(classString)
	// 	}

	// 	rootClass = rootClasses.next()
	// }
	// document.documentElement.classList.add(`colorblind-type-${value}`)

	if (value === 'none') {
		document.body.removeAttribute('data-colorblind-type')
		document.body.removeAttribute('data-color-vision-deficiency-severity')
	} else {
		document.body.setAttribute('data-color-vision-deficiency-type', value)
		document.body.setAttribute('data-color-vision-deficiency-severity', 9)
	}
}

/**
 * Handles changes to the headingFontFace setting.
 *
 * @param {string} value The new value of the headingFontFace setting.
 */
function handleHeadingFontFaceChange(value) {
	document.documentElement.style.setProperty('--heading-font-face', `'${value}'`)
}

/**
 * Handles changes to the textFontFace setting.
 *
 * @param {string} value The new value of the textFontFace setting.
 */
function handleTextFontFaceChange(value) {
	document.documentElement.style.setProperty('--text-font-face', `'${value}'`)
}





/**
 * Handles changes to the config file.
 */
export function useConfigWatcher() {
	useEffect(() => {
		handleColorblindTypeChange(configStore.get('settings.accessibility.colorblindType'))
		handleHeadingFontFaceChange(configStore.get('settings.accessibility.headingFontFace'))
		handleTextFontFaceChange(configStore.get('settings.accessibility.textFontFace'))

		const unsubscribers = [
			configStore.onDidChange('settings.accessibility.colorblindType', handleColorblindTypeChange),
			configStore.onDidChange('settings.accessibility.headingFontFace', handleHeadingFontFaceChange),
			configStore.onDidChange('settings.accessibility.textFontFace', handleTextFontFaceChange),
		]

		return () => unsubscribers.forEach(unsubscriber => unsubscriber())
	}, [])
}
