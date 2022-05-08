// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





export const EditorContext = createContext({
	defaultZoom: 1,
	focusedItemID: null,
	openItems: {},
	selection: null,
	tile: null,
	tool: 'marquee',
	zoom: 1,

	// eslint-disable-next-line jsdoc/require-jsdoc
	activateHandTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	activateMarqueeTool: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	closeItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	focusItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	openItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setActiveTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	setSelection: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomIn: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomOut: () => {},
})





export function EditorContextProvider(props) {
	const { children } = props

	const [defaultZoom, setDefaultZoom] = useState(1)
	const [focusedItemID, setFocusedItemID] = useState(null)
	const [openItems, setOpenItems] = useState({})
	const [selection, setSelection] = useState(null)
	const [tile, setTile] = useState(null)
	const [tool, setTool] = useState('marquee')
	const [zoom, setZoom] = useState(defaultZoom)

	const activateHandTool = useCallback(() => setTool('hand'), [setTool])

	const activateMarqueeTool = useCallback(() => setTool('marquee'), [setTool])

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

	const setActiveTile = useCallback(tileID => setTile(tileID), [setTile])

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

	const providerState = useMemo(() => {
		return {
			activateHandTool,
			activateMarqueeTool,
			closeItem,
			defaultZoom,
			focusedItemID,
			focusItem,
			openItem,
			openItems,
			selection,
			setActiveTile,
			setSelection,
			tile,
			tool,
			zoom,
			zoomIn,
			zoomOut,
		}
	}, [
		activateHandTool,
		activateMarqueeTool,
		closeItem,
		defaultZoom,
		focusedItemID,
		focusItem,
		openItem,
		openItems,
		selection,
		setActiveTile,
		setSelection,
		tile,
		tool,
		zoom,
		zoomIn,
		zoomOut,
	])

	useEffect(() => {
		const rootElement = document.querySelector(':root')
		const rootStyles = getComputedStyle(rootElement)
		const rootScale = Number(rootStyles.getPropertyValue('--ui-scale'))

		setDefaultZoom(rootScale)
		setZoom(rootScale)
	}, [
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





// eslint-disable-next-line jsdoc/require-jsdoc
export const useEditor = () => useContext(EditorContext)
