// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../../Button.jsx'
import { Combobox } from '../../Combobox.jsx'
import { configStore } from '../../../helpers/configStore.js'





// Constants
const DISPLAY_MODE_OPTIONS = [
	{
		label: 'Fullscreen',
		value: 'fullscreen',
	},
	{
		label: 'Windowed',
		value: 'windowed',
	},
	{
		label: 'Fullscreen Extended Window',
		value: 'fullscreen extended window',
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
export function GraphicsSettings(props) {
	const { variants } = props

	const [displaysInformation, setDisplaysInformation] = useState(null)
	const [isLoadingDisplaysInformation, setIsLoadingDisplaysInformation] = useState(false)

	const [displayMode, setDisplayMode] = useState((() => {
		const currentValue = configStore.get('settings.graphics.displayMode')

		return DISPLAY_MODE_OPTIONS.find(option => {
			return option.value === currentValue
		})
	})())

	const [displayResolution, setDisplayResolution] = useState((() => {
		const currentValue = configStore.get('settings.graphics.displayResolution')

		return DISPLAY_MODE_OPTIONS.find(option => {
			return option.value === currentValue
		})
	})())

	const [pixelScale, setPixelScale] = useState((() => {
		const currentValue = configStore.get('settings.graphics.pixelScale')

		return DISPLAY_MODE_OPTIONS.find(option => {
			return option.value === currentValue
		})
	})())

	const [screenRefreshRate, setScreenRefreshRate] = useState((() => {
		const currentValue = configStore.get('settings.graphics.screenRefreshRate')

		return DISPLAY_MODE_OPTIONS.find(option => {
			return option.value === currentValue
		})
	})())

	const displayResolutionOptions = useMemo(() => {
		return [
			{ value: '3840x2160' },
			{ value: '1920x1080' },
		]
	}, [])

	const getDisplaysInformation = useCallback(async() => {
		setIsLoadingDisplaysInformation(true)

		const displaysInfo = await ipcRenderer.invoke('getDisplaysInformation')
		setDisplaysInformation(displaysInfo)

		console.log({ displaysInfo })

		setIsLoadingDisplaysInformation(false)
	}, [
		setDisplaysInformation,
		setIsLoadingDisplaysInformation,
	])

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		const [width, height] = displayResolution.value.split('x')
		const newDisplayResolution = {
			height: Number(height),
			width: Number(width),
		}

		configStore.set('settings.graphics.displayMode', displayMode.value)
		configStore.set('settings.graphics.displayResolution', newDisplayResolution)
	}, [
		displayMode,
		displayResolution,
	])

	const handleReset = useCallback(() => {
		const previousDisplayMode = configStore.get('settings.graphics.displayMode')

		setDisplayMode(DISPLAY_MODE_OPTIONS.find(displayModeOption => {
			return displayModeOption.value === previousDisplayMode
		}))
	}, [setDisplayMode])

	useEffect(() => {
		if (!isLoadingDisplaysInformation && !displaysInformation) {
			getDisplaysInformation()
		}
	}, [
		displaysInformation,
		getDisplaysInformation,
		isLoadingDisplaysInformation,
	])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			id={'graphics-settings'}
			initial={'initial'}
			variants={variants}>
			<header className={'panel-header'}>
				<h2>{'Graphics'}</h2>
			</header>

			<form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label>{'Display Mode'}</label>
						<Combobox
							onChange={setDisplayMode}
							options={DISPLAY_MODE_OPTIONS}
							value={displayMode} />
					</div>

					<div className={'field'}>
						<label>{'Display Resolution'}</label>
						<Combobox
							onChange={setDisplayResolution}
							options={displayResolutionOptions}
							value={displayResolution} />
					</div>
				</div>

				<menu type={'toolbar'}>
					<div className={'menu-right'}>
						<Button onClick={handleReset}>
							{'Reset'}
						</Button>

						<Button
							isAffirmative
							isSubmit>
							{'Apply Changes'}
						</Button>
					</div>
				</menu>
			</form>
		</motion.div>
	)
}

GraphicsSettings.defaultProps = {
	variants: null,
}

GraphicsSettings.propTypes = {
	variants: PropTypes.object,
}
