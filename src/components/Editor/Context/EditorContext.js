// Module imports
import { createContext } from 'react'





// Local imports
import { initialState } from './initialState.js'





export const EditorContext = createContext({
	...initialState,

	// eslint-disable-next-line jsdoc/require-jsdoc
	activateBrushTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateDestinationTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateEraserTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateMarqueeTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateMoveTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateStartingPositionTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	addNotification: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	eraseTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	closeItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	focusItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	openItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	paintTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeDestination: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setActiveTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setIsPathfindingGridVisible: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setIsStartingPositionVisible: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setSelection: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setStartingPosition: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	toggleDestination: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomIn: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomOut: () => {},
})
