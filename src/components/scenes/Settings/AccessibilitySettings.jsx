// Module imports
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'





// Local imports
import { AccessibilityFormContents } from './AccessibilityFormContents.jsx'
import { Form } from '../../Forms/Form.jsx'





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

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			id={'accessibility-settings'}
			initial={'initial'}
			variants={variants}>
			<h2>{'Accessibility'}</h2>

			<Form>
				<AccessibilityFormContents />
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
