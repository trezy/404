// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





// Local imports
import { EditorContext } from './EditorContext.js'
import { initialState } from './initialState.js'
import { useStore } from '../../../store/react.js'





export function EditorContextProvider(props) {
	const { children } = props

	const contentManager = useStore(state => state.contentManager)

	const [activeTile, setActiveTile] = useState(initialState.activeTile)
	const [currentLayerIndex, setCurrentLayerIndex] = useState(initialState.currentLayerIndex)
	const [defaultZoom, setDefaultZoom] = useState(initialState.defaultZoom)
	const [destinations, setDestinations] = useState(initialState.destinations)
	const [notifications, setNotifications] = useState(initialState.notifications)
	const [focusedItemID, setFocusedItemID] = useState(initialState.focusedItemID)
	const [isDestinationsVisible, setIsDestinationsVisible] = useState(initialState.isDestinationsVisible)
	const [isPathfindingGridVisible, setIsPathfindingGridVisible] = useState(initialState.isPathfindingGridVisible)
	const [isStartingPositionVisible, setIsStartingPositionVisible] = useState(initialState.isStartingPositionVisible)
	const [layers, setLayers] = useState(initialState.layers)
	const [pfgridStacks, setPfgridStacks] = useState(initialState.pfgridStacks)
	const [openItems, setOpenItems] = useState(initialState.openItems)
	const [selection, setSelection] = useState(initialState.selection)
	const [startingPosition, setStartingPosition] = useState(initialState.startingPosition)
	const [tool, setTool] = useState(initialState.tool)
	const [zoom, setZoom] = useState(initialState.zoom)

	const scale = useMemo(() => {
		const rootElement = document.querySelector(':root')
		const rootStyles = getComputedStyle(rootElement)
		const rootScale = Number(rootStyles.getPropertyValue('--ui-scale'))

		return rootScale
	}, [])

	const addNotification = useCallback(notification => {
		const notificationID = uuid()

		setNotifications(previousState => {
			return [
				...previousState,
				{
					id: notificationID,
					...notification,
				},
			]
		})

		setTimeout(() => {
			setNotifications(previousState => previousState.filter(item => item.id !== notificationID))
		}, notification.duration ?? 5000)
	}, [setNotifications])

	const activateBrushTool = useCallback(() => setTool('brush'), [setTool])

	const activateDestinationTool = useCallback(() => setTool('destination'), [setTool])

	const activateEraserTool = useCallback(() => setTool('eraser'), [setTool])

	const activateMarqueeTool = useCallback(() => setTool('marquee'), [setTool])

	const activateMoveTool = useCallback(() => setTool('move'), [setTool])

	const activateStartingPositionTool = useCallback(() => setTool('startingPosition'), [setTool])

	const closeAllItems = useCallback(() => {
		setFocusedItemID(null)
		setOpenItems({})
		setZoom(1)
	}, [
		setFocusedItemID,
		setOpenItems,
		setZoom,
	])

	const closeItem = useCallback(itemID => {
		if (focusedItemID === itemID) {
			const itemIDs = Object.keys(openItems)
			let newItemToFocus = null

			if (itemIDs.length - 1) {
				const itemIndex = itemIDs.indexOf(itemID)
				let indexToFocus = itemIndex - 1

				if (itemIDs.length === 2) {
					indexToFocus = itemIDs.findIndex(xItemID => xItemID !== itemID)
				} else if (indexToFocus === -1) {
					indexToFocus = 1
				}

				newItemToFocus = itemIDs[indexToFocus]
			}

			setFocusedItemID(newItemToFocus)
		}

		setZoom(1)
		setOpenItems(previousState => {
			delete previousState[itemID]
			return { ...previousState }
		})
	}, [
		focusedItemID,
		openItems,
		setOpenItems,
	])

	const eraseTile = useCallback(options => {
		const {
			cellX,
			cellY,
		} = options

		const coordinateString = `${cellX}|${cellY}`

		setLayers(previousState => {
			return previousState.map((layer, index) => {
				if (index === currentLayerIndex) {
					const newLayer = { ...layer }

					delete newLayer[coordinateString]

					return newLayer
				} else {
					return layer
				}
			})
		})

		setPfgridStacks(previousState => {
			if (previousState[coordinateString]) {
				delete previousState[coordinateString]?.[currentLayerIndex]

				if (!Object.keys(previousState[coordinateString]).length) {
					delete previousState[coordinateString]
				}
			}

			return { ...previousState }
		})

		if ((cellX === startingPosition?.x) && (cellY === startingPosition?.y)) {
			setStartingPosition(null)
			addNotification({ message: 'Removed starting position because its tile was erased.' })
		}

		if (destinations[coordinateString]) {
			setDestinations(previousState => {
				const newState = { ...previousState }

				delete newState[coordinateString]

				addNotification({ message: 'Removed destination because its tiles was erased.' })

				return newState
			})
		}
	}, [
		addNotification,
		currentLayerIndex,
		destinations,
		setDestinations,
		setLayers,
		setPfgridStacks,
		startingPosition,
	])

	const openItem = useCallback(newItem => {
		const newItemID = newItem.itemID || uuid()

		setOpenItems(previousState => ({
			...previousState,
			[newItemID]: newItem,
		}))

		setFocusedItemID(newItemID)
		setSelection(null)
		setZoom(defaultZoom)
	}, [
		defaultZoom,
		setFocusedItemID,
		setOpenItems,
		setZoom,
	])

	const focusItem = useCallback(itemID => {
		setFocusedItemID(itemID)
		setSelection(null)
		setZoom(defaultZoom)
	}, [
		defaultZoom,
		setFocusedItemID,
	])

	const setActiveTileWrapper = useCallback((tileID, resourcepackID) => {
		setActiveTile({
			tileID,
			resourcepackID,
		})
	}, [setActiveTile])

	const zoomIn = useCallback(() => {
		setZoom(previousValue => {
			if (previousValue === 0.1) {
				return 0.5
			}

			return previousValue + 0.5
		})
	}, [setZoom])

	const zoomOut = useCallback(() => {
		setZoom(previousValue => {
			const newValue = previousValue - 0.5

			if (newValue <= 0) {
				return 0.1
			}

			return newValue
		})
	}, [setZoom])

	const currentLayer = useMemo(() => {
		return layers[currentLayerIndex]
	}, [
		currentLayerIndex,
		layers,
	])

	const paintTile = useCallback(options => {
		const {
			cellX,
			cellY,
		} = options

		const coordinateString = `${cellX}|${cellY}`
		const tileData = contentManager.getTile(activeTile.tileID, activeTile.resourcepackID)

		setLayers(previousState => {
			return previousState.map((layer, index) => {
				if (index === currentLayerIndex) {
					return {
						...layer,
						[coordinateString]: activeTile,
					}
				} else {
					return layer
				}
			})
		})

		setPfgridStacks(previousState => {
			if (!previousState[coordinateString]) {
				previousState[coordinateString] = {}
			}

			previousState[coordinateString][currentLayerIndex] = {
				isBlocking: tileData.isBlocking,
				isTraversable: tileData.isTraversable,
			}

			return { ...previousState }
		})
	}, [
		activeTile,
		contentManager,
		currentLayerIndex,
		setLayers,
		setPfgridStacks,
	])

	const pfgrid = useMemo(() => {
		return Object
			.entries(pfgridStacks)
			.reduce((accumulator, [coordinateString, layers]) => {
				const tileState = {
					isBlocking: false,
					isTraversable: false,
				}

				Object
					.values(layers)
					.forEach(tileData => {
						if (tileData.isBlocking) {
							tileState.isBlocking = true
							tileState.isTraversable = false
						} else if (!tileState.isBlocking && tileData.isTraversable) {
							tileState.isTraversable = true
						}
					})

				accumulator[coordinateString] = tileState

				return accumulator
			}, {})
	}, [pfgridStacks])

	const toggleDestination = useCallback(destination => {
		const coordinateString = `${destination.x}|${destination.y}`

		if ((destination.x === startingPosition.x) && (destination.y === startingPosition)) {
			addNotification({
				message: 'Destination and starting position cannot occupy the same tile.',
				type: 'error',
			})
		} else if (destinations[coordinateString]) {
			setDestinations(previousState => {
				const newState = { ...previousState }

				delete newState[coordinateString]

				return newState
			})
		} else if (pfgrid[coordinateString]?.isTraversable) {
			setDestinations(previousState => {
				return {
					...previousState,
					[coordinateString]: true,
				}
			})
		} else {
			addNotification({
				message: 'Destinations can only be placed on traversable tiles.',
				type: 'error',
			})
		}
	}, [
		addNotification,
		destinations,
		pfgrid,
		setDestinations,
		startingPosition,
	])

	const replaceState = useCallback(newState => {
		if (newState.layers) {
			setLayers(newState.layers)

			setPfgridStacks(newState.layers.reduce((accumulator, layer, layerIndex) => {
				Object.entries(layer).forEach(([coordinateString, tileIDs]) => {
					const tileData = contentManager.getTile(tileIDs.tileID, tileIDs.resourcepackID)

					if (!accumulator[coordinateString]) {
						accumulator[coordinateString] = {}
					}

					accumulator[coordinateString][layerIndex] = {
						isBlocking: tileData.isBlocking,
						isTraversable: tileData.isTraversable,
					}
				})

				return accumulator
			}, {}))
		}

		if (newState.destinations) {
			setDestinations(newState.destinations)
		}

		if (newState.startingPosition) {
			setStartingPosition(newState.startingPosition)
		}
	}, [
		setDestinations,
		setLayers,
		setPfgridStacks,
		setStartingPosition,
	])

	const setStartingPositionWrapper = useCallback(newStartingPosition => {
		const coordinateString = `${newStartingPosition.x}|${newStartingPosition.y}`

		if (destinations[coordinateString]) {
			addNotification({
				message: 'Starting position and destination cannot occupy the same tile.',
				type: 'error',
			})
		} else if (pfgrid[coordinateString]?.isTraversable) {
			setStartingPosition(newStartingPosition)
		} else {
			addNotification({
				message: 'Starting position can only be placed on a traversable tile.',
				type: 'error',
			})
		}
	}, [
		addNotification,
		destinations,
		pfgrid,
		setStartingPosition,
	])

	const providerState = useMemo(() => {
		return {
			activateBrushTool,
			activateDestinationTool,
			activateEraserTool,
			activateMoveTool,
			activateMarqueeTool,
			activateStartingPositionTool,
			activeTile,
			toggleDestination,
			addNotification,
			closeAllItems,
			closeItem,
			currentLayer,
			defaultZoom,
			destinations,
			eraseTile,
			notifications,
			focusedItemID,
			focusItem,
			isDestinationsVisible,
			isPathfindingGridVisible,
			isStartingPositionVisible,
			layers,
			openItem,
			openItems,
			paintTile,
			pfgrid,
			replaceState,
			scale,
			selection,
			setActiveTile: setActiveTileWrapper,
			setIsDestinationsVisible,
			setIsPathfindingGridVisible,
			setIsStartingPositionVisible,
			setSelection,
			setStartingPosition: setStartingPositionWrapper,
			startingPosition,
			tool,
			zoom,
			zoomIn,
			zoomOut,
		}
	}, [
		activateBrushTool,
		activateDestinationTool,
		activateEraserTool,
		activateMoveTool,
		activateMarqueeTool,
		activateStartingPositionTool,
		activeTile,
		toggleDestination,
		addNotification,
		closeAllItems,
		closeItem,
		currentLayer,
		defaultZoom,
		destinations,
		eraseTile,
		notifications,
		focusedItemID,
		focusItem,
		isDestinationsVisible,
		isPathfindingGridVisible,
		isStartingPositionVisible,
		layers,
		openItem,
		openItems,
		paintTile,
		pfgrid,
		replaceState,
		scale,
		selection,
		setActiveTileWrapper,
		setIsDestinationsVisible,
		setIsPathfindingGridVisible,
		setIsStartingPositionVisible,
		setSelection,
		setStartingPosition,
		startingPosition,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	])

	useEffect(() => {
		setDefaultZoom(scale)
		setZoom(scale)
	}, [
		scale,
		setDefaultZoom,
		setZoom,
	])

	return (
		<EditorContext.Provider value={providerState}>
			{children}
		</EditorContext.Provider>
	)
}

EditorContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}
