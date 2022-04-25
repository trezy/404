// Module imports
import PropTypes from 'prop-types'
import { useCallback } from 'react'





// Local imports
import { Combobox } from '../Combobox.jsx'
import { useForm } from './Form.jsx'
import { useFormField } from './FormField.jsx'





/**
 * Renders a switch component that uses context from its parent form and field.
 *
 * @param {object} props All component props.
 * @param {string} [props.className] Classes to be applied to the rendered component.
 * @param {string} [props.emptyMessage] Text to be displayed when there are no options.
 * @param {boolean} [props.isDisabled] Whether or not the component is currently interactive.
 * @param {Array} [props.options] A list of options to be displayed in the list.
 * @param {object} [props.initialValue] Allows the current value of the combobox to be maintained externally.
 * @param {Function} [props.validate] A function to be used to validate the value of this combobox.
 */
export function FormCombobox(props) {
	const {
		className,
		emptyMessage,
		initialValue,
		isDisabled,
		options,
		validate,
	} = props
	const {
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
		props,
		updateValue,
		internalValidate,
	])

	return (
		<Combobox
			className={className}
			emptyMessage={emptyMessage}
			id={fieldID}
			isDisabled={isDisabled}
			onChange={handleChange}
			options={options}
			value={values[fieldID] ?? initialValue} />
	)
}

FormCombobox.defaultProps = {
	className: '',
	emptyMessage: null,
	initialValue: null,
	isDisabled: null,
	options: null,
	validate: null,
}

FormCombobox.propTypes = {
	className: PropTypes.string,
	emptyMessage: PropTypes.string,
	initialValue: PropTypes.object,
	isDisabled: PropTypes.bool,
	options: PropTypes.array,
	validate: PropTypes.func,
}
