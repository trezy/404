// Module imports
import {
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { initialState } from './initialState.js'
import { PanelContext } from './PanelContext.js'





/**
 * Provides context to a panel's child components.
 *
 * @component
 */
export function PanelContextProvider(props) {
	const { children } = props

	const [isLoading, setIsLoading] = useState(initialState.isLoading)

	const providerState = useMemo(() => {
		return {
			isLoading,
			setIsLoading,
		}
	}, [
		isLoading,
		setIsLoading,
	])

	return (
		<PanelContext.Provider value={providerState}>
			{children}
		</PanelContext.Provider>
	)
}

PanelContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}
