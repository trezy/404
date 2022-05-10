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

	// eslint-disable-next-line jsdoc/require-jsdoc
	addAssets: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	addTile: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeAsset: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeTile: () => {},
})





export function AssetsContextProvider(props) {
	const { children } = props

	const [assets, setAssets] = useState({})
	const [tiles, setTiles] = useState({})

	const addAssets = useCallback(newAssets => {
		setAssets(oldAssets => ({
			...oldAssets,
			...newAssets,
		}))
	}, [setAssets])

	const addTile = useCallback(newTile => {
		setTiles(oldTiles => ({
			...oldTiles,
			[uuid()]: newTile,
		}))
	}, [setTiles])

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

	const providerState = useMemo(() => {
		return {
			addAssets,
			addTile,
			assets,
			removeAsset,
			removeTile,
			tiles,
		}
	}, [
		addAssets,
		addTile,
		assets,
		removeAsset,
		removeTile,
		tiles,
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
