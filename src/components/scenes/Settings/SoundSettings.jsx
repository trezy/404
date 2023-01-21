// Module imports
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { DecoratedHeader } from '../../DecoratedHeader/DecoratedHeader.jsx'





/**
 * Manage the game controls.
 *
 * @param {object} props All component props.
 * @param {object} [props.variants] An object representing variations of the component's state to be used for animations.
 * @param {object} [props.variants.animate] The typical state of the component.
 * @param {object} [props.variants.exit] The state to which the component should be animated when it is unmounted.
 * @param {object} [props.variants.initial] The state from which the component should be animated when it is mounted.
 */
export function SoundSettings(props) {
	const { variants } = props

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			initial={'initial'}
			variants={variants}>
			<DecoratedHeader>{'Sound'}</DecoratedHeader>

			<div />
		</motion.div>
	)
}

SoundSettings.defaultProps = {
	variants: null,
}

SoundSettings.propTypes = {
	variants: PropTypes.object,
}
