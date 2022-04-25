// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Switch } from '../Switch.jsx'
import { useForm } from './Form.jsx'
import { useFormField } from './FormField.jsx'





/**
 * Renders a switch component that uses context from its parent form and field.
 *
 * @param {object} props All props.
 * @param {boolean} [props.initialValue = false] The initial state of this switch.
 * @param {Function} [props.validate] A function to be used to validate the value of this component.
 */
export function FormSwitch(props) {
	const {
		initialValue,
		validate,
	} = props
	const {
		resetField,
		setInitialValue,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const { fieldID } = useFormField()

	const internalValidate = useCallback(async(state, initialProps) => {
		const errors = []

		if (typeof validate === 'function') {
			const customError = await validate(state, initialProps)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(fieldID, errors)
	}, [
		fieldID,
		updateValidity,
		validate,
	])

	const handleChange = useCallback(value => {
		updateValue(fieldID, value)
		internalValidate(value, props)
	}, [
		fieldID,
		internalValidate,
		props,
		updateValue,
	])

	useEffect(() => {
		setInitialValue(fieldID, initialValue)

		return () => resetField(fieldID)
	}, [
		fieldID,
		initialValue,
		resetField,
		setInitialValue,
	])

	useEffect(() => updateValidity(fieldID, []), [
		fieldID,
		updateValidity,
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
	validate: null,
}

FormSwitch.propTypes = {
	initialValue: PropTypes.bool,
	validate: PropTypes.func,
}
