// Module imports
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import styles from './Switch.module.scss'

import { NavGraphNode } from '../NavGraph/NavGraphNode.jsx'





/**
 * An interactive component that represents a binary state.
 *
 * @param {object} props All props.
 * @param {boolean} [props.defaultOn] Whether or not this switch will be activated by default.
 * @param {string} [props.id] A unique identifier for this component.
 * @param {boolean} props.isNavGroupDefault Whether this node will be used as the default for its node.
 * @param {boolean} [props.isOn] Whether or not this switch is currently activated.
 * @param {string} props.nodeID The ID to be used for this button in the navgraph.
 * @param {string} props.navGroupID The ID of the group to which this node will belong in the navgraph.
 * @param {string[]} props.navGroupLinks An array of IDs to which this node's group will be linked.
 * @param {Function} props.onActivate A function to be executed when the button is activated via the navgraph.
 * @param {Function} [props.onChange] A function to be called when the value changes.
 * @param {Function} [props.onDeactivate] A function to be executed when the button is deactivated via the navgraph.
 * @param {Function} [props.onFocus] A function to be executed when the button is focused within the navgraph.
 */
export function Switch(props) {
	const {
		defaultOn,
		id,
		isNavGroupDefault,
		isOn,
		nodeID,
		navGroupID,
		navGroupLinks,
		onActivate,
		onChange,
		onDeactivate,
		onFocus,
	} = props

	const ref = useRef(null)

	const [state, setState] = useState(Boolean(defaultOn))

	const compiledIsOn = useMemo(() => {
		if (typeof isOn === 'boolean') {
			return isOn
		}

		return state
	}, [
		isOn,
		state,
	])

	const compiledClassName = useMemo(() => {
		return classnames(styles['switch'], {
			[styles['is-on']]: compiledIsOn,
		})
	}, [compiledIsOn])

	const handleActivate = useCallback(() => {
		onActivate(!compiledIsOn)
		setState(previousState => !previousState)
	}, [
		compiledIsOn,
		onActivate,
		setState,
	])

	const handleChange = useCallback(event => {
		const isChecked = event.target.checked

		onChange(isChecked)
		setState(isChecked)
	}, [
		onChange,
		setState,
	])

	useEffect(() => {
		const defaultOnNotABoolean = typeof defaultOn !== 'boolean'
		const isOnNotABoolean = typeof isOn !== 'boolean'
		const onChangeIsAFunction = typeof onChange === 'function'

		if (onChangeIsAFunction && isOnNotABoolean && defaultOnNotABoolean) {
			throw new Error('`<Switch>` components with an `onChange` prop must also be provided either an `isOn` or a `defaultOn` prop.')
		}
	}, [
		defaultOn,
		isOn,
		onChange,
	])

	return (
		<NavGraphNode
			id={nodeID}
			isDefault={isNavGroupDefault}
			groupID={navGroupID}
			groupLinks={navGroupLinks}
			onActivate={handleActivate}
			onDeactivate={onDeactivate}
			onFocus={onFocus}
			targetRef={ref}>
			<label
				ref={ref}
				className={compiledClassName}
				htmlFor={id}>
				<motion.span
					className={styles['thumb']}
					layout />

				<input
					checked={compiledIsOn}
					className={styles['control']}
					id={id}
					onChange={handleChange}
					type={'checkbox'} />
			</label>
		</NavGraphNode>
	)
}

Switch.defaultProps = {
	defaultOn: null,
	id: null,
	isNavGroupDefault: false,
	isOn: null,
	navGroupLinks: [],
	onChange: () => {},
	onDeactivate: () => {},
	onFocus: () => {},
}

Switch.propTypes = {
	defaultOn: PropTypes.bool,
	id: PropTypes.string,
	isNavGroupDefault: PropTypes.bool,
	isOn: PropTypes.bool,
	navGroupID: PropTypes.string.isRequired,
	navGroupLinks: PropTypes.arrayOf(PropTypes.string),
	nodeID: PropTypes.string.isRequired,
	onActivate: PropTypes.func.isRequired,
	onChange: PropTypes.func,
	onDeactivate: PropTypes.func,
	onFocus: PropTypes.func,
}
