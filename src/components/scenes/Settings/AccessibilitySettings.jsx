// Module imports
import {
	useCallback,
	useState,
} from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { capitalise } from '../../../helpers/capitalise.js'
import { Combobox } from '../../Combobox.jsx'
import { configStore } from '../../../helpers/configStore.js'
import { Switch } from '../../Switch.jsx'





const COLORBLIND_OPTIONS = [
	{
		label: 'None',
		value: 'none',
	},
	{
		label: 'Deuteranopia',
		value: 'deuteranopia',
	},
	{
		label: 'Protanopia',
		value: 'protanopia',
	},
	{
		label: 'Tritanopia',
		value: 'tritanopia',
	},
]





/**
 * Manage the game controls.
 *
 * @param {object} props All component props.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
 */
export function AccessibilitySettings(props) {
	const { variants } = props

	const [colorblindType, setColorblindType] = useState((() => {
		/** @type {string} */
		const currentValue = configStore.get('settings.accessibility.colorblindType')

		return COLORBLIND_OPTIONS.find(colorblindOption => {
			return colorblindOption.value === currentValue
		})
	})())


	const [
		/** @type {boolean} */
		usePixelFonts,
		setUsePixelFonts,
	] = useState(configStore.get('settings.accessibility.usePixelFonts'))

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			initial={'initial'}
			variants={variants}>
			<h2>{'Accessibility'}</h2>

			<div>
				{'Colorblind Type'}
				<Combobox
					emptyMessage={'No gamepads connected'}
					onChange={setColorblindType}
					options={COLORBLIND_OPTIONS}
					value={colorblindType} />
			</div>

			<div>
				{`Use Pixel Fonts: ${JSON.stringify(usePixelFonts)}`}
				<Switch
					// @ts-ignore
					isOn={usePixelFonts}
					onChange={setUsePixelFonts} />
			</div>

		</motion.div>
	)
}

AccessibilitySettings.defaultProps = {
	variants: null,
}

AccessibilitySettings.propTypes = {
	variants: PropTypes.object,
}
