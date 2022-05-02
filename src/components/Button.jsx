// Module imports
import classnames from 'classnames'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useMemo } from 'react'





/**
 * A wrapper for safely creating buttons.
 *
 * @param {object} props All component props.
 * @param {*} [props.children] Node to be rendered inside of the button.
 * @param {string} [props.className] A string of classes to be set on the button.
 * @param {string} [props.forceAnimationInclusion] Whether or not to set animation variants forcefully.
 * @param {string} [props.id] A unique identifier for this button.
 * @param {boolean} [props.isAffirmative = false] Whether or not this button will cause an affirmative action.
 * @param {boolean} [props.isDisabled = false] Whether or not this button is disabled.
 * @param {boolean} [props.isFullWidth = false] Whether or not this button should take up the full width of its parent.
 * @param {boolean} [props.isNegative = false] Whether or not this button will cause an negative action.
 * @param {boolean} [props.isSmall = false] Whether or not this button should be smaller than normal.
 * @param {boolean} [props.isSubmit = false] Whether or not this button should be smaller than normal.
 * @param {boolean} [props.isText = false] Whether or not this button should be rendered as only text.
 * @param {boolean} [props.isUniformlyPadded = false] Whether or not this button shoudl have the same padding on all sides.
 * @param {Function} [props.onClick] The function to be executed when this button is clicked.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
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
		isNegative,
		isSmall,
		isSubmit,
		isText,
		isUniformlyPadded,
		onClick,
		variants,
	} = props

	const compiledProps = useMemo(() => {
		// Start by compiling `aria-` and `data-` props
		const result = Object.entries(props).reduce((accumulator, [key, value]) => {
			if (key.startsWith('aria-') || key.startsWith('data-')) {
				accumulator[key] = value
			}

			return accumulator
		}, {
			className: classnames('button', className, {
				'is-affirmative': isAffirmative,
				'is-full-width': isFullWidth,
				'is-negative': isNegative,
				'is-small': isSmall,
				'is-text': isText,
				'is-uniformly-padded': isUniformlyPadded,
			}),
			disabled: isDisabled,
			key: id,
			onClick,
			type: isSubmit ? 'submit' : 'button',
			variants,
		})

		if (forceAnimationInclusion) {
			result.animate = 'animate'
			result.exit = 'exit'
			result.initial = 'initial'
		}

		return result
	}, [
		className,
		forceAnimationInclusion,
		id,
		isAffirmative,
		isDisabled,
		isFullWidth,
		isNegative,
		isSmall,
		isSubmit,
		isText,
		isUniformlyPadded,
		onClick,
		props,
		variants,
	])

	return (
		<motion.button {...compiledProps}>
			{children}
		</motion.button>
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
	isNegative: false,
	isSmall: false,
	isSubmit: false,
	isText: false,
	isUniformlyPadded: false,
	// eslint-disable-next-line jsdoc/require-jsdoc
	onClick: () => {},
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
	isNegative: PropTypes.bool,
	isSmall: PropTypes.bool,
	isSubmit: PropTypes.bool,
	isText: PropTypes.bool,
	isUniformlyPadded: PropTypes.bool,
	onClick: PropTypes.func,
	variants: PropTypes.shape({
		animate: PropTypes.object,
		exit: PropTypes.object,
		initial: PropTypes.object,
	}),
}
