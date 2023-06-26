// Local imports
import { TileMapManager } from '../../game2/structures/TileMapManager.js'
import { store } from '../store.js'





/** Moves entities based on their velocity. */
export function placeTileset() {
	const {
		currentTileset,
		lastPlaceUpdate,
		map,
		viewport,
	} = store.state

	const now = performance.now()

	if ((now - lastPlaceUpdate) < 125) {
		return
	}

	if (currentTileset && !TileMapManager.haveConflicts(currentTileset, map)) {
		const newMap = TileMapManager.mergeTileMaps(map, currentTileset)

		viewport.removeChild(map.sprite)
		map.sprite.destroy(({ children: true }))

		viewport.removeChild(currentTileset.sprite)
		currentTileset.sprite.destroy(({ children: true }))

		viewport.addChildAt(newMap.sprite, 1)

		store.set(() => ({
			currentTileset: null,
			map: newMap,
			lastPlaceUpdate: now,
		}))
	}
}
