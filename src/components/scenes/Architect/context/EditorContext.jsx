// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





// Local imports
import { useStore } from '../../../../store/react.js'





export const EditorContext = createContext({
	activeTile: null,
	currentLayer: null,
	defaultZoom: 1,
	focusedItemID: null,
	layers: [{}],
	openItems: {},
	resourcepacks: [],
	selection: null,
	tool: 'marquee',
	zoom: 1,

	// eslint-disable-next-line jsdoc/require-jsdoc
	activateBrushTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateEraserTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateHandTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateMarqueeTool: () => {},
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
	saveMap: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setActiveTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setSelection: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateResourcepacks: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomIn: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomOut: () => {},
})





export function EditorContextProvider(props) {
	const { children } = props

	const [activeTile, setActiveTile] = useState(null)
	const [currentLayerIndex, setCurrentLayerIndex] = useState(0)
	const [defaultZoom, setDefaultZoom] = useState(1)
	const [focusedItemID, setFocusedItemID] = useState(null)
	const [isSaving, setIsSaving] = useState(false)
	const [layers, setLayers] = useState([{}])
	const [name, setName] = useState('')
	const [openItems, setOpenItems] = useState({})
	const [resourcepacks, setResourcepacks] = useState({})
	const [selection, setSelection] = useState(null)
	const [tool, setTool] = useState('marquee')
	const [zoom, setZoom] = useState(defaultZoom)

	const contentManager = useStore(state => state.contentManager)

	const scale = useMemo(() => {
		const rootElement = document.querySelector(':root')
		const rootStyles = getComputedStyle(rootElement)
		const rootScale = Number(rootStyles.getPropertyValue('--ui-scale'))

		return rootScale
	}, [])

	const activateBrushTool = useCallback(() => setTool('brush'), [setTool])
	const activateEraserTool = useCallback(() => setTool('eraser'), [setTool])

	const activateHandTool = useCallback(() => setTool('hand'), [setTool])

	const activateMarqueeTool = useCallback(() => setTool('marquee'), [setTool])

	const handleResourcepackLoaded = useCallback(resourcepackID => {
		setResourcepacks(previousState => {
			return {
				...previousState,
				[resourcepackID]: { ...contentManager.getResourcepack(resourcepackID) },
			}
		})
	}, [contentManager])

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

	const compileMap = useCallback(() => {
		return {
			dependencies: Object.entries(resourcepacks).reduce((accumulator, [resourcepackID, resourcePackData]) => {
				accumulator[resourcepackID] = resourcePackData.version
				return accumulator
			}, {}),
			name,
			layers,
		}
	}, [
		layers,
		name,
		resourcepacks,
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

	const saveMap = useCallback(async() => {
		setIsSaving(true)
		const compiledMap = compileMap()
		await ipcRenderer.invoke('saveMap', compiledMap)
		setIsSaving(false)
	}, [
		compileMap,
		setIsSaving,
	])

	const setActiveTileConvenience = useCallback((tileID, resourcepackID) => {
		setActiveTile({
			tileID,
			resourcepackID,
		})
	}, [setActiveTile])

	const updateResourcepacks = useCallback(selectedResourcepacks => {
		const updatedResourcepacks = Object
			.entries(selectedResourcepacks)
			.reduce((accumulator, [resourcepackID, isEnabled]) => {
				if (isEnabled) {
					contentManager.loadResourcepack(resourcepackID)
					accumulator[resourcepackID] = { ...contentManager.getResourcepack(resourcepackID) }
				} else {
					contentManager.unloadResourcepack(resourcepackID)
					delete accumulator[resourcepackID]
				}
				return accumulator
			}, {})

		setResourcepacks(updatedResourcepacks)
	}, [
		contentManager,
		setResourcepacks,
	])

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
			activateHandTool,
			activateMarqueeTool,
			activeTile,
			closeItem,
			currentLayer,
			defaultZoom,
			eraseTile,
			focusedItemID,
			focusItem,
			isSaving,
			layers,
			name,
			openItem,
			openItems,
			paintTile,
			resourcepacks,
			saveMap,
			scale,
			selection,
			setActiveTile: setActiveTileConvenience,
			setName,
			setSelection,
			tool,
			updateResourcepacks,
			zoom,
			zoomIn,
			zoomOut,
		}
	}, [
		activeTile,
		activateBrushTool,
		activateEraserTool,
		activateHandTool,
		activateMarqueeTool,
		closeItem,
		currentLayer,
		defaultZoom,
		eraseTile,
		focusedItemID,
		focusItem,
		isSaving,
		layers,
		name,
		openItem,
		openItems,
		paintTile,
		resourcepacks,
		saveMap,
		scale,
		selection,
		setActiveTileConvenience,
		setName,
		setSelection,
		tool,
		updateResourcepacks,
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

	useEffect(() => {
		contentManager.on('resourcepack:loaded', handleResourcepackLoaded)

		return () => {
			contentManager.off('resourcepack:loaded', handleResourcepackLoaded)
		}
	}, [
		contentManager,
		handleResourcepackLoaded,
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





// eslint-disable-next-line jsdoc/require-jsdoc
export const useEditor = () => useContext(EditorContext)
