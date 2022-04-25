// Module imports
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Local imports
import { Switch } from '../Switch.jsx'
import { useForm } from './Form.jsx'
import { useFormField } from './FormField.jsx'





/**
 * Renders a switch component that uses context from its parent form and field.
 *
 * @param {object} props All props.
 * @param {boolean} [props.initialValue = false] The initial state of this switch.
 */
export function FormSwitch(props) {
	const { initialValue } = props
	const {
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const { fieldID } = useFormField()

	const validate = useCallback(async(state, initialProps) => {
		const errors = []

		if (typeof initialProps.validate === 'function') {
			const customError = await initialProps.validate(state)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(fieldID, errors)
	}, [
		fieldID,
		updateValidity,
	])

	const handleChange = useCallback(value => {
		updateValue(fieldID, value)
		validate(value, props)
	}, [
		fieldID,
		props,
		updateValue,
		validate,
	])

	return (
		<Switch
			id={fieldID}
			isOn={values[fieldID] ?? initialValue}
			onChange={handleChange} />
	)
}

FormSwitch.defaultProps = {
	initialValue: false,
}

FormSwitch.propTypes = {
	initialValue: PropTypes.bool,
}
