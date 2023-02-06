// Module imports
import { ipcRenderer } from 'electron'
import { makeStore } from 'statery'
import { v4 as uuid } from 'uuid'





// Local imports
import { ContentManager } from '../../game/ContentManager.js'
import { executePromiseWithMinimumDuration } from '../../helpers/executePromiseWithMinimumDuration.js'
import { TILE_SIZE } from '../../game/Tile.js'





export const store = makeStore({
	activeTabID: null,
	activeTileBrush: null,
	contentManager: new ContentManager,
	cursorX: 0,
	cursorY: 0,
	dragOffset: {
		x: 0,
		y: 0,
	},
	dragStartOffset: null,
	hasDestinations: false,
	hasStartingPosition: false,
	hasTiles: false,
	isExportMapModalVisible: false,
	isSavingMap: false,
	isLoadingMap: false,
	isLoadMapModalVisible: false,
	isManageResourcepacksModalVisible: false,
	isDestinationsVisible: true,
	isPathfindingGridVisible: false,
	isStartingPositionVisible: true,
	maps: {},
	notifications: [],
	openItems: [],
	renderOffset: {
		x: 0,
		y: 0,
	},
	resolution: window.devicePixelRatio || 1,
	tool: 'move',
	toolIsActive: false,
	uiScale: (() => {
		const rootElement = document.querySelector(':root')
		const rootElementStyles = getComputedStyle(rootElement)
		return Number(rootElementStyles.getPropertyValue('--ui-scale'))
	})(),
})





/******************************************************************************\
 * Maps/tilesets
\******************************************************************************/

export const closeItem = itemID => {
	store.set(state => {
		const patch = {
			openItems: state.openItems.filter(item => (item.id !== itemID)),
		}

		if (state.activeTabID === itemID) {
			if (state.openItems.length === 1) {
				patch.activeTabID = null
			} else {
				const itemIndex = state.openItems.findIndex(item => (item.id === itemID))

				if (itemIndex === (state.openItems.length - 1)) {
					patch.activeTabID = state.openItems[itemIndex - 1].id
				} else {
					patch.activeTabID = state.openItems[itemIndex + 1].id
				}
			}
		}

		return patch
	})
}

export const closeMap = mapID => {
	closeItem(mapID)
	store.set(state => {
		const patch = {}

		patch.maps = { ...state.maps }
		delete patch.maps[mapID]

		return patch
	})
}

export const createMap = (mapData = {}) => {
	return {
		dependencies: mapData.dependencies || {},
		destinations: mapData.destinations || [],
		dimensions: mapData.dimensions || {
			height: 0,
			width: 0,
		},
		id: mapData.id || uuid(),
		layers: mapData.tiles || [],
		name: mapData.name || '',
		pfgrid: mapData.pfgrid || {},
		startingPosition: mapData.startingPosition || null,
	}
}

export const openMap = async mapID => {
	store.set(() => ({ isLoadingMap: true }))

	let mapData = {}

	if (mapID) {
		const { contentManager } = store.state
		mapData = await executePromiseWithMinimumDuration(contentManager.loadMap(mapID), 2000)
	}

	const map = createMap(mapData)

	store.set(state => ({
		activeTabID: map.id,
		isLoadingMap: false,
		maps: {
			...state.maps,
			[mapData.id]: map,
		},
		openItems: [
			...state.openItems,
			{
				id: map.id,
				label: map.name,
			},
		],
	}))
}

export const saveMap = async () => {
	store.set(() => ({ isSavingMap: true }))

	const {
		activeTabID,
		maps,
	} = store.state

	const map = maps[activeTabID]

	await executePromiseWithMinimumDuration(ipcRenderer.invoke('saveMap', map), 2000)

	store.set(() => ({ isSavingMap: false }))
}

export const updateMap = patch => {
	store.set(state => {
		const mapID = state.activeTabID

		const updatedMap = {
			...state.maps[mapID],
			...patch,
		}

		if (patch.layers) {
			updatedMap.pfgrid = generateTilemapForMap(updatedMap)
		}

		return {
			maps: {
				...state.maps,
				[mapID]: updatedMap,
			},
		}
	})
}

export const generateTilemapForMap = map => {
	const { contentManager } = store.state

	const newPFGrid = {}

	map.layers.forEach(layer => {
		Object
			.entries(layer)
			.forEach(([coordinateString, tileData]) => {
				const tile = contentManager.getTile(tileData.tileID, tileData.resourcepackID)

				if (!newPFGrid[coordinateString]) {
					newPFGrid[coordinateString] = {
						isBlocking: tile.isBlocking,
						isTraversable: tile.isTraversable,
					}
				} else {
					const isBlocking = newPFGrid[coordinateString].isBlocking || tile.isBlocking
					const isTraversable = !isBlocking && (newPFGrid[coordinateString].isTraversable || tile.isTraversable)

					newPFGrid[coordinateString] = {
						isBlocking,
						isTraversable,
					}
				}
			})
	})

	return newPFGrid
}





/******************************************************************************\
 * Tabs
\******************************************************************************/

export const closeTab = tabID => {
	store.set(() => ({
		activeTabID: tabID,
	}))
}

export const focusTab = tabID => {
	store.set(() => ({
		activeTabID: tabID,
	}))
}





/******************************************************************************\
 * Tools
\******************************************************************************/

export const activateBrushTool = (tileID, resourcepackID) => {
	store.set(() => {
		const patch = { tool: 'brush' }

		if (tileID && resourcepackID) {
			patch.activeTileBrush = {
				tileID,
				resourcepackID,
			}
		}

		return patch
	})
}

export const activateDestinationTool = () => {
	store.set(() => ({ tool: 'destination' }))
}

export const activateEraserTool = () => {
	store.set(() => ({ tool: 'eraser' }))
}

export const activateMoveTool = () => {
	store.set(() => ({ tool: 'move' }))
}

export const activateStartingPositionTool = () => {
	store.set(() => ({ tool: 'starting position' }))
}

export const activateTool = () => {
	store.set(() => ({ toolIsActive: true }))
}

export const deactivateTool = () => {
	store.set(() => ({ toolIsActive: false }))
}

export const showDestinations = () => {
	store.set(() => ({ isDestinationsVisible: true }))
}

export const hideDestinations = () => {
	store.set(() => ({ isDestinationsVisible: false }))
}

export const showPathfindingGrid = () => {
	store.set(() => ({ isPathfindingGridVisible: true }))
}

export const hidePathfindingGrid = () => {
	store.set(() => ({ isPathfindingGridVisible: false }))
}

export const showStartingPosition = () => {
	store.set(() => ({ isStartingPositionVisible: true }))
}

export const hideStartingPosition = () => {
	store.set(() => ({ isStartingPositionVisible: false }))
}

export const eraseTile = () => {
	const {
		activeTabID,
		cursorX,
		cursorY,
		maps,
		renderOffset,
		resolution,
		uiScale,
	} = store.state

	const pixelX = Math.floor(cursorX * (resolution / uiScale))
	const pixelY = Math.floor(cursorY * (resolution / uiScale))

	const cellX = Math.floor((pixelX - renderOffset.x) / TILE_SIZE.width)
	const cellY = Math.floor((pixelY - renderOffset.y) / TILE_SIZE.height)

	const coordinateString = `${cellX}|${cellY}`

	const map = maps[activeTabID]

	const newLayer = { ...map.layers[0] }
	delete newLayer[coordinateString]

	const mapPatch = {
		layers: [newLayer],
	}

	if ((map.startingPosition?.x === cellX) && (map.startingPosition?.y === cellY)) {
		mapPatch.startingPosition = null
		addNotification({ message: 'Removed starting position because its tile was erased.' })
	}

	const cellIsOccupiedByDestination = map.destinations.some(destination => {
		return (destination.x === cellX) && (destination.y === cellY)
	})

	if (cellIsOccupiedByDestination) {
		mapPatch.destinations = map.destinations.filter(destination => {
			return (destination.x !== cellX) || (destination.y !== cellY)
		})

		addNotification({ message: 'Removed destination because its tiles was erased.' })
	}

	updateMap(mapPatch)
}

export const paintTile = () => {
	const {
		activeTabID,
		activeTileBrush,
		cursorX,
		cursorY,
		maps,
		renderOffset,
		resolution,
		uiScale,
	} = store.state

	const pixelX = Math.floor(cursorX * (resolution / uiScale))
	const pixelY = Math.floor(cursorY * (resolution / uiScale))

	const cellX = Math.floor((pixelX - renderOffset.x) / TILE_SIZE.width)
	const cellY = Math.floor((pixelY - renderOffset.y) / TILE_SIZE.height)

	const coordinateString = `${cellX}|${cellY}`

	const map = maps[activeTabID]

	updateMap({
		layers: [
			{
				...map.layers[0],
				[coordinateString]: { ...activeTileBrush },
			},
		],
	})
}

export const setStartingPosition = () => {
	const {
		activeTabID,
		cursorX,
		cursorY,
		maps,
		renderOffset,
		resolution,
		uiScale,
	} = store.state

	const pixelX = Math.floor(cursorX * (resolution / uiScale))
	const pixelY = Math.floor(cursorY * (resolution / uiScale))

	const cellX = Math.floor((pixelX - renderOffset.x) / TILE_SIZE.width)
	const cellY = Math.floor((pixelY - renderOffset.y) / TILE_SIZE.height)

	const coordinateString = `${cellX}|${cellY}`

	const map = maps[activeTabID]

	if (!map.pfgrid[coordinateString]?.isTraversable) {
		addNotification({
			message: 'Starting position can only be placed on a traversable tile.',
			type: 'error',
		})
		return
	}

	const cellIsOccupiedByDestination = map.destinations.some(destination => {
		return (destination.x === cellX) && (destination.y === cellY)
	})

	if (cellIsOccupiedByDestination) {
		addNotification({
			message: 'Starting position and destination cannot occupy the same tile.',
			type: 'error',
		})
		return
	}

	if (map.pfgrid[coordinateString]?.isTraversable) {
		updateMap({
			startingPosition: {
				x: cellX,
				y: cellY,
			},
		})
	}
}

export const toggleDestination = () => {
	const {
		activeTabID,
		cursorX,
		cursorY,
		maps,
		renderOffset,
		resolution,
		uiScale,
	} = store.state

	const pixelX = Math.floor(cursorX * (resolution / uiScale))
	const pixelY = Math.floor(cursorY * (resolution / uiScale))

	const cellX = Math.floor((pixelX - renderOffset.x) / TILE_SIZE.width)
	const cellY = Math.floor((pixelY - renderOffset.y) / TILE_SIZE.height)

	const coordinateString = `${cellX}|${cellY}`

	const map = maps[activeTabID]

	if (!map.pfgrid[coordinateString]?.isTraversable) {
		addNotification({
			message: 'Destinations can only be placed on traversable tiles.',
			type: 'error',
		})
		return
	}

	if ((map.startingPosition?.x === cellX) && (map.startingPosition?.y === cellY)) {
		addNotification({
			message: 'Destination and starting position cannot occupy the same tile.',
			type: 'error',
		})
		return
	}

	const destinationExists = map.destinations.some(destination => {
		return (destination.x === cellX) && (destination.y === cellY)
	})

	if (destinationExists) {
		updateMap({
			destinations: map.destinations.filter(destination => {
				return (destination.x !== cellX) || (destination.y !== cellY)
			})
		})
	} else if (map.pfgrid[coordinateString]?.isTraversable) {
		updateMap({
			destinations: [
				...map.destinations,
				{
					x: cellX,
					y: cellY,
				},
			],
		})
	}
}





/******************************************************************************\
 * Canvas events
\******************************************************************************/

export const endDrag = () => {
	store.set(state => ({
		dragOffset: {
			x: 0,
			y: 0,
		},
		dragStartOffset: null,
		renderOffset: {
			x: state.renderOffset.x + state.dragOffset.x,
			y: state.renderOffset.y + state.dragOffset.y,
		},
	}))
}

export const startDrag = (x, y) => {
	store.set(() => ({
		dragStartOffset: {
			x,
			y,
		},
	}))
}

export const updateDrag = (x, y) => {
	store.set(state => ({
		dragOffset: {
			x: Math.floor((x - state.dragStartOffset.x) / state.uiScale),
			y: Math.floor((y - state.dragStartOffset.y) / state.uiScale),
		},
	}))
}





/******************************************************************************\
 * Cursor position
\******************************************************************************/

export const setCursorPosition = (x, y) => {
	store.set(state => ({
		cursorX: x / state.resolution,
		cursorY: y / state.resolution,
	}))
}

export const unsetCursorPosition = () => {
	store.set(() => ({
		cursorX: null,
		cursorY: null,
	}))
}





/******************************************************************************\
 * Modals
\******************************************************************************/

export const hideExportMapModal = () => {
	store.set(() => ({ isExportMapModalVisible: false }))
}

export const showExportMapModal = () => {
	store.set(() => ({ isExportMapModalVisible: true }))
}

export const hideLoadMapModal = () => {
	store.set(() => ({ isLoadMapModalVisible: false }))
}

export const showLoadMapModal = () => {
	store.set(() => ({ isLoadMapModalVisible: true }))
}

export const hideManageResourcePacksModal = () => {
	store.set(() => ({ isManageResourcepacksModalVisible: false }))
}

export const showManageResourcePacksModal = () => {
	store.set(() => ({ isManageResourcepacksModalVisible: true }))
}





/******************************************************************************\
 * Notifications
\******************************************************************************/

export const addNotification = notification => {
	const notificationID = uuid()

	store.set(state => {
		return {
			notifications: [
				...state.notifications,
				{
					id: notificationID,
					...notification,
				},
			]
		}
	})

	setTimeout(() => removeNotification(notificationID), notification.duration ?? 5000)

	return notificationID
}

export const removeNotification = notificationID => {
	store.set(state => {
		return {
			notifications: state.notifications.filter(notification => {
				return notification.id !== notificationID
			}),
		}
	})
}





/******************************************************************************\
 * Getters
\******************************************************************************/

export const hasDestinations = ({ activeTabID, maps }) => {
	const map = maps[activeTabID]

	return Boolean(map?.destinations.length)
}

export const hasTiles = ({ activeTabID, maps }) => {
	const map = maps[activeTabID]

	return map?.layers.some(layer => {
		return Object.keys(layer).length
	})
}

export const hasStartingPosition = ({ activeTabID, maps }) => {
	const map = maps[activeTabID]

	return Boolean(map?.startingPosition)
}
