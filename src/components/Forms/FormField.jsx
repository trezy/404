// Module imports
import {
	createContext,
	useContext,
	useId,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from './Form.jsx'





export const FormFieldContext = createContext({})

/**
 * Wrapper for form controls. Handles rendering of labels and helper text.
 *
 * @param {object} props All props.
 * @param {import('react').ReactNode} props.children The form control(s) to be rendered.
 * @param {string} props.className Classes to be applied to the wrapper.
 * @param {import('react').ReactNode} props.helperText Text to be displayed in small font below the control.
 * @param {string} props.id A unique identifier for this component.
 * @param {boolean} props.isRequired Whether or not this field is required for the form to be valid.
 * @param {import('react').ReactNode} props.label The contents of the label.
 */
export function FormField(props) {
	const {
		children,
		className,
		helperText,
		id,
		isRequired,
		label,
	} = props
	const { errors: formErrors } = useForm()
	const generatedID = useId()
	const fieldID = id ?? generatedID

	const renderedHelpers = useMemo(() => {
		if (formErrors[fieldID]?.length) {
			return (
				<ul>
					{formErrors[fieldID].map(error => (
						<li
							key={error}
							className={'help is-danger'}>
							{error}
						</li>
					))}
				</ul>
			)
		}

		if (helperText) {
			return (
				<p className={'help'}>{helperText}</p>
			)
		}

		return null
	}, [
		fieldID,
		formErrors,
		helperText,
	])

	const renderedLabel = useMemo(() => {
		if (label) {
			return (
				<label htmlFor={fieldID}>
					{label}
					{isRequired && (
						<span>{'*'}</span>
					)}
				</label>
			)
		}

		return null
	}, [
		fieldID,
		isRequired,
		label,
	])

	const providerState = useMemo(() => {
		return {
			fieldID,
			isRequired,
		}
	}, [
		fieldID,
		isRequired,
	])

	return (
		<FormFieldContext.Provider value={providerState}>
			<div className={classnames('field', className)}>
				{renderedLabel}
				{children}
				{renderedHelpers}
			</div>
		</FormFieldContext.Provider>
	)
}

FormField.defaultProps = {
	children: null,
	className: null,
	helperText: null,
	id: null,
	isRequired: false,
	label: null,
}

FormField.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	helperText: PropTypes.node,
	id: PropTypes.string,
	isRequired: PropTypes.bool,
	label: PropTypes.node,
}

/**
 * @returns {object} Context state.
 */
export const useFormField = () => useContext(FormFieldContext)
