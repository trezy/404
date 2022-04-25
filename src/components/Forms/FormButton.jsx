// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Button } from '../Button.jsx'
import { useForm } from './Form.jsx'





/**
 * Renders a button that is mostly controlled by its parent form component.
 *
 * @param {object} props All component props.
 * @param {import('react').ReactNode} props.children Children of the component.
 * @param {boolean} [props.isDisabled] Whether or not this button should be disabled. By default this is controlled by the parent form component.
 */
export function FormButton(props) {
	const {
		children,
		isDisabled,
	} = props
	const {
		isTouched,
		isValid,
	} = useForm()

	return (
		<Button
			{...props}
			isDisabled={isDisabled || !isValid || !isTouched}>
			{children}
		</Button>
	)
}

FormButton.defaultProps = {
	isDisabled: false,
}

FormButton.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
}
