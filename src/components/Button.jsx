// Module imports
import {
	useCallback,
	useMemo,
	useRef,
} from 'react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { NavGraphNode } from './NavGraph/NavGraphNode.jsx'
import { useNavGraphContext } from './NavGraph/NavGraphContextProvider.jsx'





/**
 * A wrapper for safely creating buttons.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the button.
 * @param {string} [props.className] A string of classes to be set on the button.
 * @param {string} [props.forceAnimationInclusion] Whether to set animation variants forcefully.
 * @param {string} [props.id] A unique identifier for this button.
 * @param {string} props.nodeID The ID to be used for this button in the navgraph.
 * @param {string} props.navGroupID The ID of the group to which this node will belong in the navgraph.
 * @param {string[]} props.navGroupLinks An array of IDs to which this node's group will be linked.
 * @param {boolean} [props.isAffirmative = false] Whether this button will cause an affirmative action.
 * @param {boolean} [props.isDisabled = false] Whether this button is disabled.
 * @param {boolean} [props.isFullWidth = false] Whether this button should take up the full width of its parent.
 * @param {boolean} [props.isNegative = false] Whether this button will cause an negative action.
 * @param {boolean} props.isNavGroupDefault Whether this node will be used as the default for its node.
 * @param {boolean} [props.isSmall = false] Whether this button should be smaller than normal.
 * @param {boolean} [props.isStyled = true] Whether to apply styles to this component.
 * @param {boolean} [props.isSubmit = false] Whether this button should be smaller than normal.
 * @param {boolean} [props.isText = false] Whether this button should be rendered as only text.
 * @param {boolean} [props.isUniformlyPadded = false] Whether this button shoudl have the same padding on all sides.
 * @param {Function} props.onActivate A function to be executed when the button is activated via the navgraph.
 * @param {Function} props.onDeactivate A function to be executed when the button is deactivated via the navgraph.
 * @param {Function} [props.onClick] The function to be executed when this button is clicked.
 * @param {Function} props.onFocus A function to be executed when the button is focused within the navgraph.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
 * @param {object} [ref] A ref to be set on the button.
 */
export function Button(props) {
	const {
		children,
		className,
		forceAnimationInclusion,
		id,
		isAffirmative,
		isDisabled,
		isFullWidth,
		isNavGroupDefault,
		isNegative,
		isSmall,
		isStyled,
		isSubmit,
		isText,
		isUniformlyPadded,
		navGroupID,
		navGroupLinks,
		nodeID,
		onActivate,
		onClick,
		onDeactivate,
		onFocus,
		variants,
	} = props

	const buttonRef = useRef(null)

	const {
		currentTargetNodeID,
		focusNode,
	} = useNavGraphContext()

	const compiledProps = useMemo(() => {
		// Start by compiling `aria-` and `data-` props
		const result = Object.entries(props).reduce((accumulator, [key, value]) => {
			if (key.startsWith('aria-') || key.startsWith('data-')) {
				accumulator[key] = value
			}

			return accumulator
		}, {
			disabled: isDisabled,
			key: id,
			onClick,
			type: isSubmit ? 'submit' : 'button',
			variants,
		})

		if (isStyled) {
			result.className = classnames('button', className, {
				'is-affirmative': isAffirmative,
				'is-full-width': isFullWidth,
				'is-gamepad-focused': currentTargetNodeID === nodeID,
				'is-negative': isNegative,
				'is-small': isSmall,
				'is-text': isText,
				'is-uniformly-padded': isUniformlyPadded,
			})
		}

		if (forceAnimationInclusion) {
			result.animate = 'animate'
			result.exit = 'exit'
			result.initial = 'initial'
		}

		return result
	}, [
		className,
		currentTargetNodeID,
		forceAnimationInclusion,
		id,
		isAffirmative,
		isDisabled,
		isFullWidth,
		isNegative,
		isSmall,
		isStyled,
		isSubmit,
		isText,
		isUniformlyPadded,
		nodeID,
		onClick,
		props,
		variants,
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
			targetRef={buttonRef}>
			<motion.button
				ref={buttonRef}
				onMouseOver={handleHover}
				{...compiledProps}>
				{children}
			</motion.button>
		</NavGraphNode>
	)
}

Button.defaultProps = {
	children: null,
	className: '',
	forceAnimationInclusion: false,
	id: '',
	isAffirmative: false,
	isDisabled: false,
	isFullWidth: false,
	isGamepadFocused: false,
	isNavGroupDefault: false,
	isNegative: false,
	isSmall: false,
	isStyled: true,
	isSubmit: false,
	isText: false,
	isUniformlyPadded: false,
	navGroupLinks: [],
	onActivate: () => {},
	onDeactivate: () => {},
	onClick: () => {},
	onFocus: () => {},
	variants: null,
}

Button.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	forceAnimationInclusion: PropTypes.bool,
	id: PropTypes.string,
	isAffirmative: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isFullWidth: PropTypes.bool,
	isGamepadFocused: PropTypes.bool,
	isNavGroupDefault: PropTypes.bool,
	isNegative: PropTypes.bool,
	isSmall: PropTypes.bool,
	isStyled: PropTypes.bool,
	isSubmit: PropTypes.bool,
	isText: PropTypes.bool,
	isUniformlyPadded: PropTypes.bool,
	navGroupID: PropTypes.string.isRequired,
	navGroupLinks: PropTypes.arrayOf(PropTypes.string),
	nodeID: PropTypes.string.isRequired,
	// onActivate: PropTypes.func.isRequired,
	onActivate: PropTypes.func,
	onDeactivate: PropTypes.func,
	onClick: PropTypes.func,
	// onFocus: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	variants: PropTypes.shape({
		animate: PropTypes.object,
		exit: PropTypes.object,
		initial: PropTypes.object,
	}),
}
