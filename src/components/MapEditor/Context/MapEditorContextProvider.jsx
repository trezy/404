// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { ipcRenderer } from 'electron'
import PropTypes from 'prop-types'





// Local imports
import { initialState } from './initialState.js'
import { MapEditorContext } from './MapEditorContext.js'
import { useEditorContext } from '../../Editor/Context/useEditorContext.js'
import { useStore } from '../../../store/react.js'





export function MapEditorContextProvider(props) {
	const { children } = props

	const [isSaving, setIsSaving] = useState(initialState.isSaving)
	const [mapName, setMapName] = useState(initialState.mapName)
	const [resourcepacks, setResourcepacks] = useState(initialState.resourcepacks)
	const {
		destinations,
		layers,
		pfgrid,
		replaceState,
		startingPosition,
	} = useEditorContext()

	const contentManager = useStore(state => state.contentManager)

	const compileMap = useCallback(() => {
		return {
			dependencies: Object.entries(resourcepacks).reduce((accumulator, [resourcepackID, resourcePackData]) => {
				accumulator[resourcepackID] = resourcePackData.version
				return accumulator
			}, {}),
			destinations,
			layers,
			name: mapName,
			pfgrid,
			startingPosition,
		}
	}, [
		layers,
		mapName,
		pfgrid,
		resourcepacks,
	])

	const handleResourcepackLoaded = useCallback(resourcepackID => {
		setResourcepacks(previousState => {
			return {
				...previousState,
				[resourcepackID]: { ...contentManager.getResourcepack(resourcepackID) },
			}
		})
	}, [contentManager])

	const saveMap = useCallback(async() => {
		setIsSaving(true)
		const compiledMap = compileMap()
		await ipcRenderer.invoke('saveMap', compiledMap)
		setIsSaving(false)
	}, [
		compileMap,
		setIsSaving,
	])

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

	const hasDestinations = useMemo(() => Boolean(Object.keys(destinations).length), [destinations])

	const hasStartingPosition = useMemo(() => Boolean(startingPosition), [startingPosition])

	const hasTiles = useMemo(() => {
		return layers.some(layer => {
			return Boolean(Object.keys(layer).length)
		})
	}, [layers])

	const loadMap = useCallback(async mapID => {
		const map = await contentManager.loadMap(mapID)

		replaceState({
			destinations: map.destinations.reduce((accumulator, destination) => {
				accumulator[`${destination.x}|${destination.y}`] = true
				return accumulator
			}, {}),
			layers: map.tiles,
			startingPosition: map.startingPosition,
		})
	}, [
		contentManager,
		replaceState,
	])

	const providerState = useMemo(() => {
		return {
			hasDestinations,
			hasStartingPosition,
			hasTiles,
			isSaving,
			loadMap,
			mapName,
			resourcepacks,
			saveMap,
			setMapName,
			updateResourcepacks,
		}
	}, [
		hasDestinations,
		hasStartingPosition,
		hasTiles,
		isSaving,
		loadMap,
		mapName,
		resourcepacks,
		saveMap,
		setMapName,
		updateResourcepacks,
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
		<MapEditorContext.Provider
			value={providerState}>
			{children}
		</MapEditorContext.Provider>
	)
}

MapEditorContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}
