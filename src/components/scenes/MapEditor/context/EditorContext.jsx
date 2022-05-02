// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





export const EditorContext = createContext({
	focusedItemID: null,
	openItems: {},
	zoom: 1,

	// eslint-disable-next-line jsdoc/require-jsdoc
	closeItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	focusItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	openItem: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomIn: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	zoomOut: () => {},
})





export function EditorContextProvider(props) {
	const { children } = props

	const [focusedItemID, setFocusedItemID] = useState(null)
	const [openItems, setOpenItems] = useState({})
	const [zoom, setZoom] = useState(1)

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

		setZoom(1)
		setFocusedItemID(newItemID)
	}, [setOpenItems])

	const focusItem = useCallback(itemID => {
		setZoom(1)
		setFocusedItemID(itemID)
	}, [setFocusedItemID])

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
			closeItem,
			focusedItemID,
			focusItem,
			openItem,
			openItems,
			zoom,
			zoomIn,
			zoomOut,
		}
	}, [
		closeItem,
		focusedItemID,
		focusItem,
		openItem,
		openItems,
		zoom,
		zoomIn,
		zoomOut,
	])

	return (
		<EditorContext.Provider
			value={providerState}>
			{children}
		</EditorContext.Provider>
	)
}

EditorContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}





// eslint-disable-next-line jsdoc/require-jsdoc
export const useEditor = () => useContext(EditorContext)
