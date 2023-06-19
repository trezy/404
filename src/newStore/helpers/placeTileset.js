// Local imports
import { store } from '../store.js'
import { renderMapToTilemap } from '../../helpers/renderMapToTilemap.js'





/** Moves entities based on their velocity. */
export function placeTileset() {
	const {
		lastPlaceUpdate,
		mapManager,
		viewport,
	} = store.state

	const now = performance.now()

	if ((now - lastPlaceUpdate) < 125) {
		return
	}

	if (mapManager.tileset) {
		mapManager.placeTileset()

		/** @type {import('pixi.js').Container} */
		const mapContainer = viewport.getChildByName('map')

		viewport.removeChild(mapContainer)
		viewport.addChildAt(renderMapToTilemap(mapManager, { name: 'map' }), 1)

		mapContainer.destroy({ children: true })
	}

	store.set(() => ({ lastPlaceUpdate: now }))
}
