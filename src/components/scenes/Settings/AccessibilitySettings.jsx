// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { Combobox } from '../../Combobox.jsx'
import { configStore } from '../../../helpers/configStore.js'
import { Form } from '../../Forms/Form.jsx'
import { FormField } from '../../Forms/FormField.jsx'
import { Switch } from '../../Switch.jsx'





// Constants
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
const GAME_FONT_OPTIONS = {
	Awkward: {
		group: 'Game Fonts',
		label: (
			<>
				<span>{'Awkward'}</span>

				<span
					className={'sample'}
					/* eslint-disable-next-line react-perf/jsx-no-new-object-as-prop */
					style={{ fontFamily: 'Awkward' }}>
					{'Awkward'}
				</span>
			</>
		),
		value: 'Awkward',
	},

	Thaleah: {
		group: 'Game Fonts',
		label: (
			<>
				<span>{'Thaleah'}</span>

				<span
					className={'sample'}
					/* eslint-disable-next-line react-perf/jsx-no-new-object-as-prop */
					style={{ fontFamily: 'Thaleah' }}>
					{'Thaleah'}
				</span>
			</>
		),
		value: 'Thaleah',
	},
}
const GAME_FONT_OPTIONS_ARRAY = Object.values(GAME_FONT_OPTIONS)





/**
 * Manage the accessibility settings.
 *
 * @param {object} props All component props.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
 */
export function AccessibilitySettings(props) {
	const { variants } = props

	const [isLoadingFonts, setIsLoadingFonts] = useState(false)
	const [fontOptions, setFontOptions] = useState(null)

	const [colorblindType, setColorblindType] = useState((() => {
		/** @type {string} */
		const currentValue = configStore.get('settings.accessibility.colorblindType')

		return COLORBLIND_OPTIONS.find(colorblindOption => {
			return colorblindOption.value === currentValue
		})
	})())

	const [headingFontFace, setHeadingFontFace] = useState(GAME_FONT_OPTIONS[configStore.get('settings.accessibility.headingFontFace')])

	const [textFontFace, setTextFontFace] = useState(GAME_FONT_OPTIONS[configStore.get('settings.accessibility.textFontFace')])

	const [
		/** @type {boolean} */
		usePixelFonts,
		setUsePixelFonts,
	] = useState(configStore.get('settings.accessibility.usePixelFonts'))

	const getFonts = useCallback(async() => {
		setIsLoadingFonts(true)

		const localFonts = await ipcRenderer.invoke('getFonts')

		setFontOptions(localFonts.reduce((accumulator, fontName) => {
			accumulator.push({
				group: 'System Fonts',
				label: (
					<>
						<span>{fontName}</span>

						<span
							className={'sample'}
							/* eslint-disable-next-line react-perf/jsx-no-new-object-as-prop */
							style={{ fontFamily: fontName }}>
							{fontName}
						</span>
					</>
				),
				value: fontName,
			})
			return accumulator
		}, [...GAME_FONT_OPTIONS_ARRAY]))

		setIsLoadingFonts(false)
	}, [
		setFontOptions,
		setIsLoadingFonts,
	])

	useEffect(() => {
		if (!usePixelFonts && !isLoadingFonts && !fontOptions) {
			getFonts()
		}
	}, [
		fontOptions,
		getFonts,
		isLoadingFonts,
		usePixelFonts,
	])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			id={'accessibility-settings'}
			initial={'initial'}
			variants={variants}>
			<h2>{'Accessibility'}</h2>

			<Form>
				<FormField label={'Colorblind Type'}>
					<Combobox
						emptyMessage={'No gamepads connected'}
						onChange={setColorblindType}
						options={COLORBLIND_OPTIONS}
						value={colorblindType} />
				</FormField>

				<FormField label={'Use Pixel Fonts'}>
					<Switch
						// @ts-ignore
						isOn={usePixelFonts}
						onChange={setUsePixelFonts} />
				</FormField>

				{!usePixelFonts && (
					<>
						{!fontOptions && 'Loading fonts...'}

						{Boolean(fontOptions) && (
							<FormField label={'Heading Font'}>
								<Combobox
									className={'font-list'}
									onChange={setHeadingFontFace}
									options={fontOptions}
									value={headingFontFace} />
							</FormField>
						)}

						{Boolean(fontOptions) && (
							<FormField label={'Text Font'}>
								<Combobox
									className={'font-list'}
									onChange={setTextFontFace}
									options={fontOptions}
									value={textFontFace} />
							</FormField>
						)}
					</>
				)}
			</Form>
		</motion.div>
	)
}

AccessibilitySettings.defaultProps = {
	variants: null,
}

AccessibilitySettings.propTypes = {
	variants: PropTypes.object,
}
