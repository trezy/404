// Module imports
import { createContext } from 'react'





// Local imports
import { initialState } from './initialState.js'





export const MapEditorContext = createContext({
	...initialState,

	// eslint-disable-next-line jsdoc/require-jsdoc
	saveMap: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setMapName: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateResourcepacks: () => {},
})
