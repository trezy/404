// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import styles from './Checkbox.module.scss'





/**
 * An interactive component that represents a binary state.
 *
 * @param {object} props All props.
 * @param {boolean} [props.defaultOn=false] Whether or not this Checkbox will be activated by default.
 * @param {string} [props.id] A unique identifier for this component.
 * @param {boolean} [props.isChecked] Whether or not this Checkbox is currently activated.
 * @param {Function} [props.onChange] A function to be called when the value changes.
 */
export function Checkbox(props) {
	const {
		defaultOn,
		id,
		isChecked,
		onChange,
	} = props

	const [state, setState] = useState(Boolean(defaultOn))

	const compiledIsChecked = useMemo(() => {
		if (typeof isChecked === 'boolean') {
			return isChecked
		}

		return state
	}, [
		isChecked,
		state,
	])

	const handleChange = useCallback(event => {
		const isElementChecked = event.target.checked

		if (typeof onChange === 'function') {
			onChange(isElementChecked)
		}

		setState(isElementChecked)
	}, [
		onChange,
		setState,
	])

	useEffect(() => {
		const defaultOnNotABoolean = typeof defaultOn !== 'boolean'
		const isCheckedNotABoolean = typeof isChecked !== 'boolean'
		const onChangeIsAFunction = typeof onChange === 'function'

		if (onChangeIsAFunction && isCheckedNotABoolean && defaultOnNotABoolean) {
			throw new Error('`<Checkbox>` components with an `onChange` prop must also be provided either an `isChecked` or a `defaultOn` prop.')
		}
	}, [
		defaultOn,
		isChecked,
		onChange,
	])

	return (
		<label
			className={styles['wrapper']}
			htmlFor={id}>
			<input
				checked={compiledIsChecked}
				id={id}
				onChange={handleChange}
				type={'checkbox'} />

			<div className={styles['checkbox']}>
				{compiledIsChecked && (
					<div className={styles['check']} />
				)}
			</div>
		</label>
	)
}

Checkbox.defaultProps = {
	defaultOn: null,
	id: null,
	isChecked: null,
	onChange: null,
}

Checkbox.propTypes = {
	defaultOn: PropTypes.bool,
	id: PropTypes.string,
	isChecked: PropTypes.bool,
	onChange: PropTypes.func,
}
