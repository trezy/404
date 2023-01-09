// Module imports
import { useMemo } from 'react'





// Local imports
import styles from './TilePalettePanel.module.scss'

import { Panel } from '../../scenes/Architect/Panel.jsx'
import { useEditor } from '../../scenes/Architect/context/EditorContext.jsx'





/**
 * Handles selecting which tile to paint with.
 */
export function TilePalettePanel() {
	const { resourcepacks } = useEditor()

	const mappedTiles = useMemo(() => {
		return Object
			.values(resourcepacks)
			.reduce((accumulator, resourcepack) => {
				if (resourcepack.tiles) {
					Object
						.entries(resourcepack.tiles)
						.forEach(([tileID, tileData]) => {
							accumulator.push((
								<li key={tileID}>
									<img
										alt={''}
										src={tileData.dataURI} />
								</li>
							))
						})
				}

				return accumulator
			}, [])
	}, [resourcepacks])

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
