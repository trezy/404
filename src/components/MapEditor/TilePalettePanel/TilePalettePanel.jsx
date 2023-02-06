// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'
import { useStore } from 'statery'





// Local imports
import styles from './TilePalettePanel.module.scss'

import {
	activateBrushTool,
	getMap,
	store,
} from '../store.js'
import { Button } from '../../Button.jsx'
import { CollapsiblePanel } from '../../CollapsiblePanel/CollapsiblePanel.jsx'





/**
 * Handles selecting which tile to paint with.
 */
export function TilePalettePanel() {
	const proxyStore = useStore(store)
	const {
		activeTileBrush,
		contentManager,
	} = proxyStore

	const map = getMap(proxyStore)

	const resourcepacks = useMemo(() => {
		if (!map) {
			return {}
		}

		return Object
			.keys(map.dependencies)
			.reduce((accumulator, resourcepackID) => {
				accumulator[resourcepackID] = contentManager.getResourcepack(resourcepackID)
				return accumulator
			}, {})
	}, [map])

	const handleTileClick = useCallback((tileID, resourcepackID) => () => {
		activateBrushTool(tileID, resourcepackID)
	}, [
		activateBrushTool,
	])

	const hasResourcePacks = useMemo(() => {
		return Boolean(Object.keys(resourcepacks).length)
	}, [resourcepacks])

	const mappedTiles = useMemo(() => {
		return Object
			.values(resourcepacks)
			.reduce((accumulator, resourcepack) => {
				if (resourcepack.tiles) {
					Object
						.entries(resourcepack.tiles)
						.forEach(([tileID, tileData]) => {
							const tileClassName = classnames(styles['tile'], {
								[styles['is-active']]: (tileID === activeTileBrush?.tileID) && (resourcepack.id === activeTileBrush?.resourcepackID),
							})

							accumulator.push((
								<li
									key={tileID}
									className={tileClassName}>
									<Button
										isStyled={false}
										onClick={handleTileClick(tileID, resourcepack.id)}>
										<img
											alt={''}
											src={tileData.dataURI} />
									</Button>
								</li>
							))
						})
				}

				return accumulator
			}, [])
	}, [
		activeTileBrush,
		handleTileClick,
		resourcepacks,
	])

	return (
		<CollapsiblePanel title={'Tiles'}>
			<ol className={styles['tile-grid']}>
				{!hasResourcePacks && (
					<li className={styles['empty-message']}>
						{'Add a resourcepack.'}
					</li>
				)}

				{hasResourcePacks && mappedTiles}
			</ol>
		</CollapsiblePanel>
	)
}
