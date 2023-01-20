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





export function EditorContextProvider(props) {
	const { children } = props

	const [activeTile, setActiveTile] = useState(initialState.activeTile)
	const [currentLayerIndex, setCurrentLayerIndex] = useState(initialState.currentLayerIndex)
	const [defaultZoom, setDefaultZoom] = useState(initialState.defaultZoom)
	const [focusedItemID, setFocusedItemID] = useState(initialState.focusedItemID)
	const [layers, setLayers] = useState(initialState.layers)
	const [openItems, setOpenItems] = useState(initialState.openItems)
	const [selection, setSelection] = useState(initialState.selection)
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
	}, [
		currentLayerIndex,
		setLayers,
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

	const setActiveTileConvenience = useCallback((tileID, resourcepackID) => {
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

		setLayers(previousState => {
			return previousState.map((layer, index) => {
				if (index === currentLayerIndex) {
					return {
						...layer,
						[`${cellX}|${cellY}`]: activeTile,
					}
				} else {
					return layer
				}
			})
		})
	}, [
		activeTile,
		currentLayerIndex,
		setLayers,
	])

	const providerState = useMemo(() => {
		return {
			activateBrushTool,
			activateEraserTool,
			activateMoveTool,
			activateMarqueeTool,
			activeTile,
			closeItem,
			currentLayer,
			defaultZoom,
			eraseTile,
			focusedItemID,
			focusItem,
			layers,
			openItem,
			openItems,
			paintTile,
			scale,
			selection,
			setActiveTile: setActiveTileConvenience,
			setSelection,
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
		closeItem,
		currentLayer,
		defaultZoom,
		eraseTile,
		focusedItemID,
		focusItem,
		layers,
		openItem,
		openItems,
		paintTile,
		scale,
		selection,
		setActiveTileConvenience,
		setSelection,
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
