// Module imports
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'





// Local imports
import styles from './TilePalettePanel.module.scss'

import { Button } from '../../Button.jsx'
import { Panel } from '../../scenes/Architect/Panel.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





/**
 * Handles selecting which tile to paint with.
 */
export function TilePalettePanel() {
	const {
		activateBrushTool,
		activeTile,
		resourcepacks,
		setActiveTile,
	} = useEditor()

	const handleTileClick = useCallback((tileID, resourcepackID) => () => {
		activateBrushTool()
		setActiveTile(tileID, resourcepackID)
	}, [
		activateBrushTool,
		setActiveTile,
	])

	const mappedTiles = useMemo(() => {
		return Object
			.values(resourcepacks)
			.reduce((accumulator, resourcepack) => {
				if (resourcepack.tiles) {
					Object
						.entries(resourcepack.tiles)
						.forEach(([tileID, tileData]) => {
							const tileClassName = classnames(styles['tile'], {
								[styles['is-active']]: (tileID === activeTile?.tileID) && (resourcepack.id === activeTile?.resourcepackID),
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
		activeTile,
		handleTileClick,
		resourcepacks,
	])

	return (
		<Panel
			className={styles['tile-palette-panel']}
			isCollapsible
			title={'Tiles'}>
			{Boolean(Object.keys(resourcepacks).length) && (
				<ol className={styles['tile-grid']}>
					{mappedTiles}
				</ol>
			)}
		</Panel>
	)
}
