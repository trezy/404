// Module imports
import { createContext } from 'react'





// Local imports
import { initialState } from './initialState.js'





export const ResourcepackEditorContext = createContext({
	...initialState,

	// eslint-disable-next-line jsdoc/require-jsdoc
	addAssets: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	compileTileset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	exportTileset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeAsset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	saveTileset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateTilesetName: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateTile: () => {},
})
