// Module imports
import {
	useCallback,
	useEffect,
} from 'react'





// Local imports
import { configStore } from '../helpers/configStore.js'





/**
 * Handles changes to the config file.
 */
export function useConfigWatcher() {
	const handleHeadingFontFaceChange = useCallback(value => {
		document.documentElement.style.setProperty('--heading-font-face', `'${value}'`)
	}, [])

	const handleTextFontFaceChange = useCallback(value => {
		document.documentElement.style.setProperty('--text-font-face', `'${value}'`)
	}, [])

	useEffect(() => {
		handleHeadingFontFaceChange(configStore.get('settings.accessibility.headingFontFace'))
		handleTextFontFaceChange(configStore.get('settings.accessibility.textFontFace'))

		const unsubscribers = [
			configStore.onDidChange('settings.accessibility.headingFontFace', handleHeadingFontFaceChange),
			configStore.onDidChange('settings.accessibility.textFontFace', handleTextFontFaceChange),
		]

		return () => {
			unsubscribers.forEach(unsubscriber => unsubscriber())
		}
	}, [
		handleHeadingFontFaceChange,
		handleTextFontFaceChange,
	])
}
