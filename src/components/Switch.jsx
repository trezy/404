// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





/**
 * An interactive component that represents a binary state.
 *
 * @param {object} props All props.
 * @param {boolean} [props.defaultOn] Whether or not this switch will be activated by default.
 * @param {string} [props.id] A unique identifier for this component.
 * @param {boolean} [props.isOn] Whether or not this switch is currently activated.
 * @param {Function} [props.onChange] A function to be called when the value changes.
 */
export function Switch(props) {
	const {
		defaultOn,
		id,
		isOn,
		onChange,
	} = props

	const [state, setState] = useState(Boolean(defaultOn))

	const compiledIsOn = useMemo(() => {
		if (typeof isOn === 'boolean') {
			return isOn
		}

		return state
	}, [
		isOn,
		state,
	])

	const handleChange = useCallback(event => {
		const isChecked = event.target.checked

		if (typeof onChange === 'function') {
			onChange(isChecked)
		}

		setState(isChecked)
	}, [
		onChange,
		setState,
	])

	useEffect(() => {
		const defaultOnNotABoolean = typeof defaultOn !== 'boolean'
		const isOnNotABoolean = typeof isOn !== 'boolean'
		const onChangeIsAFunction = typeof onChange === 'function'

		if (onChangeIsAFunction && isOnNotABoolean && defaultOnNotABoolean) {
			throw new Error('`<Switch>` components with an `onChange` prop must also be provided either an `isOn` or a `defaultOn` prop.')
		}
	}, [
		defaultOn,
		isOn,
		onChange,
	])

	return (
		<label
			className={'switch'}
			htmlFor={id}>
			<input
				checked={compiledIsOn}
				id={id}
				onChange={handleChange}
				type={'checkbox'} />
			{JSON.stringify(compiledIsOn)}
		</label>
	)
}

Switch.defaultProps = {
	defaultOn: null,
	id: null,
	isOn: null,
	onChange: null,
}

Switch.propTypes = {
	defaultOn: PropTypes.bool,
	id: PropTypes.string,
	isOn: PropTypes.bool,
	onChange: PropTypes.func,
}
