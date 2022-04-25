// Module imports
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Local imports
import { AccessibilityFormContents } from './AccessibilityFormContents.jsx'
import { configStore } from '../../../helpers/configStore.js'
import { Form } from '../../Forms/Form.jsx'
import { FormButton } from '../../Forms/FormButton.jsx'





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

	const handleSubmit = useCallback(state => {
		Object.entries(state.values)
			.forEach(([key, value]) => {
				if (typeof value === 'object') {
					value = value.value
				}

				if (state.values.usePixelFonts) {
					if (key === 'headingFontFace') {
						value = 'Thaleah'
					} else if (key === 'textFontFace') {
						value = 'Awkward'
					}
				}

				configStore.set(`settings.accessibility.${key}`, value)
			})
	}, [])

	return (
		<motion.div
			animate={'animate'}
			exit={'exit'}
			id={'accessibility-settings'}
			initial={'initial'}
			variants={variants}>
			<h2>{'Accessibility'}</h2>

			<Form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<AccessibilityFormContents />
				</div>

				<menu type={'toolbar'}>
					<div className={'menu-right'}>
						<FormButton
							isPrimary
							type={'submit'}>
							{'Save'}
						</FormButton>
					</div>
				</menu>
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
