// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





/**
 * Standardised input renderer
 *
 * @param {object} props All component props.
 * @param {'center' | 'left' | 'right'} [props.alignment] Text alignment.
 * @param {string} [props.className] A string of classes to be set on the component.
 * @param {string} [props.id] A unique identifier.
 * @param {string} [props.name] A name with which to identify this input. Should be unique within its parent form.
 * @param {'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week'} [props.type] The type of input to be rendered. Affects validation, as well as input type for devices that support alternate keyboards.
 * @param {Function} [props.onChange] A function to be called when the contents of this input are changed.
 * @param {boolean} [props.readOnly] Whether or not this input's contents can be altered.
 * @param {string} [props.value] The current value.
 */
export function Input(props) {
	const {
		alignment,
		className,
		id,
		name,
		onChange,
		readOnly,
		type,
		value,
	} = props

	const compiledClassName = useMemo(() => {
		return classnames(className, {
			'text-align-center': alignment === 'center',
			'text-align-left': alignment === 'left',
			'text-align-right': alignment === 'right',
		})
	}, [
		alignment,
		className,
	])

	const handleChange = useCallback(event => {
		if (typeof onChange === 'function') {
			onChange(event)
		}
	}, [onChange])

	return (
		<input
			className={compiledClassName}
			id={id}
			name={name}
			onChange={handleChange}
			readOnly={readOnly}
			type={type}
			value={value} />
	)
}

Input.defaultProps = {
	alignment: 'left',
	className: '',
	id: '',
	name: '',
	onChange: null,
	readOnly: false,
	type: 'text',
	value: '',
}

Input.propTypes = {
	alignment: PropTypes.oneOf([
		'center',
		'left',
		'right',
	]),
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func,
	readOnly: PropTypes.bool,
	type: PropTypes.oneOf([
		'date',
		'datetime-local',
		'email',
		'month',
		'number',
		'password',
		'search',
		'tel',
		'text',
		'time',
		'url',
		'week',
	]),
	value: PropTypes.string,
}
