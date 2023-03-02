// Module imports
import {
	useCallback,
	useState,
} from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Module imports
import styles from './ControlsSettings.module.scss'

import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'
import { GamepadSettings } from '../../GamepadSettings/GamepadSettings.jsx'
import { KeyboardAndMouseSettings } from '../../KeyboardAndMouseSettings/KeyboardAndMouseSettings.jsx'
import { Tabs } from '../../Tabs/Tabs.jsx'





// Constants
const TABS = [
	{
		id: 'keyboard',
		label: 'Keyboard & Mouse',
	},
	{
		id: 'controller',
		label: 'Controller',
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
export function ControlsSettings(props) {
	const { variants } = props

	const [activeTabID, setActiveTabID] = useState('keyboard')

	const handleTabFocus = useCallback(tabID => setActiveTabID(tabID), [setActiveTabID])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			className={styles['wrapper']}
			initial={'initial'}
			variants={variants}>
			<DecoratedHeader className={styles['decorated-header']}>
				{'Controls'}
			</DecoratedHeader>

			<Tabs
				activeTabID={activeTabID}
				onFocus={handleTabFocus}
				tabs={TABS} />

			{(activeTabID === 'keyboard') && (
				<KeyboardAndMouseSettings />
			)}

			{(activeTabID === 'controller') && (
				<GamepadSettings />
			)}
		</motion.div>
	)
}

ControlsSettings.defaultProps = {
	variants: null,
}

ControlsSettings.propTypes = {
	variants: PropTypes.object,
}
