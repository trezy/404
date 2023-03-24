// Module imports
import {
	useCallback,
	useId as useID,
	useMemo,
	useRef,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import styles from './ComboboxButton.module.scss'

import { NavGraphNode } from '../NavGraph/NavGraphNode.jsx'
import { useComboboxContext } from './Combobox.jsx'
import { useNavGraphContext } from '../NavGraph/NavGraphContextProvider.jsx'





export function ComboboxButton(props) {
	const {
		children,
		className,
		id,
		isNavGroupDefault,
		navGroupID,
		navGroupLinks,
		onActivate,
		onDeactivate,
		onFocus,
		onKeyUp,
	} = props

	const {
		comboboxID,
		isDisabled,
	} = useComboboxContext()

	const ref = useRef(null)
	const internalID = useID()

	const {
		currentTargetNodeID,
		focusNode,
	} = useNavGraphContext()

	const nodeID = useMemo(() => `${id}`, [
		comboboxID,
		id,
		internalID,
	])

	const compiledClassName = useMemo(() => {
		return classnames(styles['button'], className, {
			[styles['is-disabled']]: isDisabled,
			[styles['is-focused']]: currentTargetNodeID === nodeID,
		})
	}, [
		className,
		currentTargetNodeID,
		isDisabled,
	])

	const handleHover = useCallback(() => focusNode(nodeID), [
		focusNode,
		nodeID,
	])

	return (
		<NavGraphNode
			id={nodeID}
			isDefault={isNavGroupDefault}
			groupID={navGroupID}
			groupLinks={navGroupLinks}
			onActivate={onActivate}
			onDeactivate={onDeactivate}
			onFocus={onFocus}
			targetRef={ref}>
			{/* eslint-disable-next-line react/forbid-elements */}
			<button
				ref={ref}
				className={compiledClassName}
				data-foo={nodeID}
				id={id}
				onClick={onActivate}
				onKeyUp={onKeyUp}
				onMouseOver={handleHover}
				type={'button'}>
				{children}
			</button>
		</NavGraphNode>
	)
}

ComboboxButton.defaultProps = {
	children: null,
	className: '',
	isNavGroupDefault: false,
	onDeactivate: () => {},
	onFocus: () => {},
}

ComboboxButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	id: PropTypes.string,
	isNavGroupDefault: PropTypes.bool,
	onActivate: PropTypes.func.isRequired,
	onDeactivate: PropTypes.func,
	onFocus: PropTypes.func,
	onKeyUp: PropTypes.func.isRequired,
}
