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
 * @param {*} action.payload The action payload.
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
	updateValidity: null,
	updateValue: null,
})

/**
 * Handles validation and submission for a form.
 *
 * @param {object} props All props
 * @param {import('react').ReactNode} props.children Children of the form.
 * @param {string} props.className Classes to be applied to the rendered component.
 * @param {object} props.initialValues The initial values to be used for form fields.
 * @param {Function} props.onSubmit The function to be called when this form is submitted.
 */
export function Form(props) {
	const {
		children,
		className,
		initialValues,
		onSubmit,
	} = props

	const [state, dispatch] = useReducer(reducer, {
		...INITIAL_STATE,
		errors: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = []
				return accumulator
			}, {}),
		initialValues,
		touched: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = false
				return accumulator
			}, {}),
		validity: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = false
				return accumulator
			}, {}),
		values: { ...initialValues },
	})

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		if (typeof onSubmit === 'function') {
			onSubmit(state)
		}
	}, [
		onSubmit,
		state,
	])

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
	}, [
		dispatch,
	])

	const providerState = useMemo(() => {
		return {
			...state,
			updateValidity,
			updateValue,
		}
	}, [
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
	initialValues: {},
	onSubmit: null,
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	initialValues: PropTypes.object,
	onSubmit: PropTypes.func,
}

/**
 * @returns {object} Context state.
 */
export const useForm = () => useContext(FormContext)
