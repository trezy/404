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
	const [focusedItemID, setFocusedItemID] = useState(initialState.focusedItemID)
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

	const activateBrushTool = useCallback(() => setTool('brush'), [setTool])

	const activateEraserTool = useCallback(() => setTool('eraser'), [setTool])

	const activateMarqueeTool = useCallback(() => setTool('marquee'), [setTool])

	const activateMoveTool = useCallback(() => setTool('move'), [setTool])

	const activateStartingPositionTool = useCallback(() => setTool('startingPosition'), [setTool])

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

		setLayers(previousState => {
			return previousState.map((layer, index) => {
				if (index === currentLayerIndex) {
					const newLayer = { ...layer }

					delete newLayer[`${cellX}|${cellY}`]

					return newLayer
				} else {
					return layer
				}
			})
		})

		setPfgridStacks(previousState => {
			const coordinateString = `${cellX}|${cellY}`

			if (previousState[coordinateString]) {
				delete previousState[coordinateString]?.[currentLayerIndex]

				if (!Object.keys(previousState[coordinateString]).length) {
					delete previousState[coordinateString]
				}
			}

			return { ...previousState }
		})
	}, [
		currentLayerIndex,
		setLayers,
		setPfgridStacks,
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

	const setStartingPositionWrapper = useCallback(newStartingPosition => {
		if (pfgrid[`${newStartingPosition.x}|${newStartingPosition.y}`]?.isTraversable) {
			setStartingPosition(newStartingPosition)
		}
	}, [
		setStartingPosition,
		pfgrid,
	])

	const providerState = useMemo(() => {
		return {
			activateBrushTool,
			activateEraserTool,
			activateMoveTool,
			activateMarqueeTool,
			activateStartingPositionTool,
			activeTile,
			closeItem,
			currentLayer,
			defaultZoom,
			eraseTile,
			focusedItemID,
			focusItem,
			isPathfindingGridVisible,
			isStartingPositionVisible,
			layers,
			openItem,
			openItems,
			paintTile,
			pfgrid,
			scale,
			selection,
			setActiveTile: setActiveTileWrapper,
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
		activeTile,
		activateBrushTool,
		activateEraserTool,
		activateMoveTool,
		activateMarqueeTool,
		activateStartingPositionTool,
		closeItem,
		currentLayer,
		defaultZoom,
		eraseTile,
		focusedItemID,
		focusItem,
		isPathfindingGridVisible,
		isStartingPositionVisible,
		layers,
		openItem,
		openItems,
		paintTile,
		pfgrid,
		scale,
		selection,
		setActiveTileWrapper,
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
