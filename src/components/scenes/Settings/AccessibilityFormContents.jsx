// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'





// Local imports
import { configStore } from '../../../helpers/configStore.js'
import { FormCombobox } from '../../Forms/FormCombobox.jsx'
import { FormField } from '../../Forms/FormField.jsx'
import { FormSwitch } from '../../Forms/FormSwitch.jsx'
import { useForm } from '../../Forms/Form.jsx'





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
 * Contents of the accessibility form.
 */
export function AccessibilityFormContents() {
	const { values } = useForm()

	const [isLoadingFonts, setIsLoadingFonts] = useState(false)
	const [fontOptions, setFontOptions] = useState(null)

	const colorblindType = useMemo(() => {
		if (typeof values['colorblindType'] !== 'undefined') {
			return values['colorblindType']
		}

		/** @type {string} */
		const currentValue = configStore.get('settings.accessibility.colorblindType')

		return COLORBLIND_OPTIONS.find(colorblindOption => {
			return colorblindOption.value === currentValue
		})
	}, [values])

	const headingFontFace = useMemo(() => {
		if (typeof values['headingFontFace'] !== 'undefined') {
			return values['headingFontFace']
		}

		return GAME_FONT_OPTIONS[configStore.get('settings.accessibility.headingFontFace')]
	}, [values])

	const textFontFace = useMemo(() => {
		if (typeof values['textFontFace'] !== 'undefined') {
			return values['textFontFace']
		}

		return GAME_FONT_OPTIONS[configStore.get('settings.accessibility.textFontFace')]
	}, [values])

	const usePixelFonts = useMemo(() => {
		if (typeof values['usePixelFonts'] !== 'undefined') {
			return values['usePixelFonts']
		}

		return configStore.get('settings.accessibility.usePixelFonts')
	}, [values])

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
		values,
	])

	return (
		<>
			<FormField
				id={'colorblindType'}
				label={'Colorblind Type'}>
				<FormCombobox
					initialValue={colorblindType}
					options={COLORBLIND_OPTIONS} />
			</FormField>

			<FormField
				id={'usePixelFonts'}
				label={'Use Pixel Fonts'}>
				<FormSwitch initialValue={usePixelFonts} />
			</FormField>

			{!usePixelFonts && (
				<>
					{!fontOptions && 'Loading fonts...'}

					{Boolean(fontOptions) && (
						<FormField label={'Heading Font'}>
							<FormCombobox
								className={'font-list'}
								initialValue={headingFontFace}
								options={fontOptions} />
						</FormField>
					)}

					{Boolean(fontOptions) && (
						<FormField label={'Text Font'}>
							<FormCombobox
								className={'font-list'}
								initialValue={textFontFace}
								options={fontOptions} />
						</FormField>
					)}
				</>
			)}
		</>
	)
}
