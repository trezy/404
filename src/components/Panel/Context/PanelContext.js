// Module imports
import { createContext } from 'react'





// Local imports
import { initialState } from './initialState.js'





export const PanelContext = createContext({
	...initialState,

	// eslint-disable-next-line jsdoc/require-jsdoc
	setIsLoading: () => {},
})
