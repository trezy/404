// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react'
import PropTypes from 'prop-types'





// Constants
const INITIAL_STATE = {
	errors: {},
	initialValues: {},
	isValid: false,
	isTouched: false,
	touched: {},
	validity: {},
	values: {},
}





/**
 * Form state reducer.
 *
 * @param {object} state The current state.
 * @param {object} action The action to be used to modify the state.
 * @param {*} [action.payload] The action payload.
 * @param {string} action.type The action type.
 * @returns {object} The modified state.
 */
function reducer(state, action) {
	const {
		payload,
		type,
	} = action
	const newState = {
		...INITIAL_STATE,
		...state,
	}

	switch (type) {
		case 'freshen':
			newState.initialValues = newState.values
			newState.isTouched = false
			newState.isValid = true

			Object.keys(newState.values).forEach(fieldName => {
				newState.errors[fieldName] = []
				newState.touched[fieldName] = false
				newState.validity[fieldName] = true
			})
			break

		case 'initial value':
			newState.errors = {
				...newState.errors,
				[payload.fieldName]: [],
			}
			newState.initialValues = {
				...newState.initialValues,
				[payload.fieldName]: payload.value,
			}
			newState.touched = {
				...newState.touched,
				[payload.fieldName]: false,
			}
			newState.validity = {
				...newState.validity,
				[payload.fieldName]: false,
			}
			newState.values = {
				...newState.values,
				[payload.fieldName]: payload.value,
			}
			break

		case 'reset field':
			delete newState.errors[payload.fieldName]
			delete newState.initialValues[payload.fieldName]
			delete newState.touched[payload.fieldName]
			delete newState.validity[payload.fieldName]
			delete newState.values[payload.fieldName]
			newState.isTouched = Object
				.values(newState.touched)
				.some(isTouched => isTouched)
			newState.isValid = !Object
				.values(newState.validity)
				.some(isValid => !isValid)
			break

		case 'validity changed':
			newState.validity = {
				...newState.validity,
				[payload.fieldName]: !payload.errors?.length,
			}
			newState.errors = {
				...newState.errors,
				[payload.fieldName]: payload.errors,
			}
			newState.isValid = !Object
				.values(newState.validity)
				.some(isValid => !isValid)
			break

		case 'value changed':
			newState.values = {
				...newState.values,
				[payload.fieldName]: payload.value,
			}
			newState.touched = {
				...newState.touched,
				[payload.fieldName]: newState.initialValues[payload.fieldName] !== payload.value,
			}
			newState.isTouched = Object
				.values(newState.touched)
				.some(isTouched => isTouched)
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





export const FormContext = createContext({
	...INITIAL_STATE,
	reset: null,
	resetField: null,
	setInitialValue: null,
	updateValidity: null,
	updateValue: null,
})

/**
 * Handles validation and submission for a form.
 *
 * @param {object} props All props
 * @param {import('react').ReactNode} props.children Children of the form.
 * @param {string} props.className Classes to be applied to the rendered component.
 * @param {Function} props.onSubmit The function to be called when this form is submitted.
 */
export function Form(props) {
	const {
		children,
		className,
		onSubmit,
	} = props

	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const freshen = useCallback(() => dispatch({ type: 'freshen' }), [])

	const resetField = useCallback(fieldName => {
		dispatch({
			payload: { fieldName },
			type: 'reset field',
		})
	}, [dispatch])

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		if (typeof onSubmit === 'function') {
			onSubmit(state)
		}

		freshen()
	}, [
		freshen,
		onSubmit,
		state,
	])

	const setInitialValue = useCallback((fieldName, value) => {
		dispatch({
			payload: {
				fieldName,
				value,
			},
			type: 'initial value',
		})
	}, [dispatch])

	const updateValidity = useCallback((fieldName, errors) => {
		dispatch({
			payload: {
				errors,
				fieldName,
			},
			type: 'validity changed',
		})
	}, [dispatch])

	const updateValue = useCallback((fieldName, value) => {
		dispatch({
			payload: {
				fieldName,
				value,
			},
			type: 'value changed',
		})
	}, [dispatch])

	const providerState = useMemo(() => {
		return {
			...state,
			freshen,
			resetField,
			setInitialValue,
			updateValidity,
			updateValue,
		}
	}, [
		freshen,
		resetField,
		setInitialValue,
		state,
		updateValidity,
		updateValue,
	])

	return (
		<FormContext.Provider
			value={providerState}>
			<form
				className={className}
				onSubmit={handleSubmit}>
				{children}
			</form>
		</FormContext.Provider>
	)
}

Form.defaultProps = {
	className: null,
	onSubmit: null,
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	onSubmit: PropTypes.func,
}

/**
 * @returns {object} Context state.
 */
export const useForm = () => useContext(FormContext)
