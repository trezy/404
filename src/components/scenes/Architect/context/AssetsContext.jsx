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





export const AssetsContext = createContext({
	assets: {},
	tiles: {},
	tilesetName: 'Untitled',

	// eslint-disable-next-line jsdoc/require-jsdoc
	addAssets: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	compileTileset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeAsset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateTilesetName: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	updateTile: () => {},
})





export function AssetsContextProvider(props) {
	const { children } = props

	const [assets, setAssets] = useState({})
	const [tiles, setTiles] = useState({})
	const [tilesetName, setTilesetName] = useState('Untitled')

	const addAssets = useCallback(newAssets => {
		setAssets(oldAssets => ({
			...oldAssets,
			...newAssets,
		}))
	}, [setAssets])

	const compileTileset = useCallback(() => {
		const parsedAssets = Object
			.entries(assets)
			.reduce((accumulator, [assetID, assetData]) => {
				accumulator[assetID] = {
					dataURL: assetData.dataURL,
					name: assetData.name,
				}

				return accumulator
			}, {})

		return {
			assets: parsedAssets,
			name: tilesetName,
			tiles,
		}
	}, [
		assets,
		tiles,
		tilesetName,
	])

	const removeAsset = useCallback(assetID => {
		setAssets(previousState => {
			const newState = { ...previousState }

			delete newState[assetID]

			return newState
		})

		setTiles(previousState => {
			return Object.entries(previousState).reduce((accumulator, [key, value]) => {
				if (value.assetID !== assetID) {
					accumulator[key] = value
				}

				return accumulator
			}, {})
		})
	}, [
		setAssets,
		setTiles,
	])

	const removeTile = useCallback(tileID => {
		setTiles(oldTiles => {
			const newTiles = { ...oldTiles }

			delete newTiles[tileID]

			return newTiles
		})
	}, [setTiles])

	const updateTilesetName = useCallback(name => setTilesetName(name), [setTilesetName])

	const updateTile = useCallback(newTile => {
		const { tileID } = newTile
		const tileObject = { ...newTile }

		delete tileObject.tileID

		setTiles(oldTiles => ({
			...oldTiles,
			[tileID || uuid()]: tileObject,
		}))
	}, [setTiles])

	const providerState = useMemo(() => {
		return {
			addAssets,
			assets,
			compileTileset,
			removeAsset,
			removeTile,
			tiles,
			tilesetName,
			updateTilesetName,
			updateTile,
		}
	}, [
		addAssets,
		assets,
		compileTileset,
		removeAsset,
		removeTile,
		tiles,
		tilesetName,
		updateTilesetName,
		updateTile,
	])

	return (
		<AssetsContext.Provider
			value={providerState}>
			{children}
		</AssetsContext.Provider>
	)
}

AssetsContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}





// eslint-disable-next-line jsdoc/require-jsdoc
export const useAssets = () => useContext(AssetsContext)
