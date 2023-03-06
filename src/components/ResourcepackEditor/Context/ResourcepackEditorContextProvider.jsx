// Module imports
import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import PropTypes from 'prop-types'
import { useStore } from 'statery'
import { v4 as uuid } from 'uuid'





// Local imports
import { initialState } from './initialState.js'
import { ResourcepackEditorContext } from './ResourcepackEditorContext.js'
import { store } from '../../../newStore/store.js'
import { useEditorContext } from '../../Editor/Context/useEditorContext.js'





export function ResourcepackEditorContextProvider(props) {
	const { children } = props

	const { contentManager } = useStore(store)

	const [assets, setAssets] = useState(initialState.assets)
	const [isExporting, setIsExporting] = useState(initialState.isExporting)
	const [isSaving, setIsSaving] = useState(initialState.isSaving)
	const [tiles, setTiles] = useState(initialState.tiles)
	const [tilesetName, setTilesetName] = useState(initialState.tilesetName)

 	const {
		closeAllItems,
		openItem,
	} = useEditorContext()

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

	const exportTileset = useCallback(async() => {
		setIsExporting(true)
		const compiledTileset = compileTileset()
		await ipcRenderer.invoke('exportTileset', compiledTileset)
		setIsExporting(false)
	}, [
		compileTileset,
		setIsExporting,
	])

	const loadResourcepack = useCallback(async resourcepackID => {
		const resourcepack = await contentManager.loadResourcepack(resourcepackID, true)

		setAssets({ ...resourcepack.assets })
		setTiles({ ...resourcepack.tiles })
		setTilesetName(resourcepack.name)

		closeAllItems()

		Object.entries(resourcepack.assets).forEach(([assetID, assetData]) => {
			openItem({
				item: assetData,
				itemID: assetID,
				type: 'asset',
			})
		})
	}, [
		closeAllItems,
		contentManager,
		openItem,
		setAssets,
		setTiles,
		setTilesetName,
	])

	const saveTileset = useCallback(async() => {
		setIsSaving(true)
		const compiledTileset = compileTileset()
		await ipcRenderer.invoke('saveTileset', compiledTileset)
		setIsSaving(false)
	}, [
		compileTileset,
		setIsSaving,
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

	const hasTiles = useMemo(() => {
		return Boolean(Object.keys(tiles).length)
	}, [tiles])

	const providerState = useMemo(() => {
		return {
			addAssets,
			assets,
			compileTileset,
			exportTileset,
			hasTiles,
			isExporting,
			isSaving,
			loadResourcepack,
			removeAsset,
			removeTile,
			saveTileset,
			tiles,
			tilesetName,
			updateTilesetName,
			updateTile,
		}
	}, [
		addAssets,
		assets,
		compileTileset,
		exportTileset,
		hasTiles,
		isExporting,
		isSaving,
		loadResourcepack,
		removeAsset,
		removeTile,
		saveTileset,
		tiles,
		tilesetName,
		updateTilesetName,
		updateTile,
	])

	return (
		<ResourcepackEditorContext.Provider
			value={providerState}>
			{children}
		</ResourcepackEditorContext.Provider>
	)
}

ResourcepackEditorContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}
