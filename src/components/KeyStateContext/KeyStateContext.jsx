// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





export const KeyStateContext = createContext({
	keyState: {},
})





export function KeyStateContextProvider(props) {
	const { children } = props

	const [keyState, setKeyState] = useState({})
	const [shouldPreventDefault, setShouldPreventDefault] = useState([])

	const handleKeyStateChange = useCallback((event, isPressed) => {
		if (shouldPreventDefault.length && ((shouldPreventDefault === 'all') || shouldPreventDefault.includes(event.key))) {
			console.log('prevented default', Object.entries(keyState).reduce((accumulator, [key, isPressed]) => {
				if (isPressed) {
					accumulator.push(key)
				}
				return accumulator
			}, []))
			event.preventDefault()
		}

		setKeyState(previousState => ({
			...previousState,
			[event.key.toLowerCase()]: isPressed,
		}))
	}, [
		keyState,
		setKeyState,
		shouldPreventDefault,
	])

	const handleKeydown = useCallback(event => handleKeyStateChange(event, true), [handleKeyStateChange])
	const handleKeyup = useCallback(event => handleKeyStateChange(event, false), [handleKeyStateChange])

	const preventDefaultForAllKeys = useCallback(() => setShouldPreventDefault('all'), [])

	const preventDefaultForKey = useCallback(key => {
		// shouldPreventDefault.forEach(keys => {
		// 	let keysArray = [keys]

		// 	if (Array.isArray(keys)) {
		// 		keysArray = [...keys]
		// 	}

		// 	keysArray.sort()
		// })

		setShouldPreventDefault(previousState => ([
			...previousState,
			key,
		]))
	}, [
		setShouldPreventDefault,
		// shouldPreventDefault,
	])

	const removeKeyFromPreventDefault = useCallback(key => {
		setShouldPreventDefault(previousState => {
			return previousState.filter(filterKey => {
				const keyType = typeof key
				const filterKeyType = typeof filterKey

				if (keyType !== filterKeyType) {
					return true
				}

				if ((keyType === 'string') && (filterKeyType === 'string')) {
					return key !== filterKey
				}

				if (Array.isArray(key) && Array.isArray(filterKey)) {
					const lengthMatches = key.length === filterKey.length
					const keysMatch = key.every(oKey => filterKey.includes(oKey))
					return lengthMatches && keysMatch
				}

				return true
			})
		})
	}, [setShouldPreventDefault])

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown)
		document.addEventListener('keyup', handleKeyup)

		return () => {
			document.removeEventListener('keydown', handleKeydown)
			document.removeEventListener('keyup', handleKeyup)
		}
	}, [
		handleKeydown,
		handleKeyup,
	])

	const providerState = useMemo(() => {
		return {
			keyState,
			preventDefaultForAllKeys,
			preventDefaultForKey,
			removeKeyFromPreventDefault,
		}
	}, [
		keyState,
		preventDefaultForAllKeys,
		preventDefaultForKey,
		removeKeyFromPreventDefault,
	])

	return (
		<KeyStateContext.Provider value={providerState}>
			{children}
		</KeyStateContext.Provider>
	)
}

KeyStateContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}





// eslint-disable-next-line jsdoc/require-jsdoc
export const useKeyState = () => useContext(KeyStateContext)
