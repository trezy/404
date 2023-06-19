// Module imports
import {
	Application,
	BaseTexture,
	SCALE_MODES,
	settings,
} from 'pixi.js'
import { Viewport } from 'pixi-viewport'




// Local imports
import { store } from '../store.js'





/**
 * Initialises the Pixi app and it's associated systems.
 */
export function setupPixiApp() {
	// Render pixel art properly.
	BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

	// Set options for pixi-tilemap.
	settings.TEXTILE_UNITS = 4
	settings.TEXTURES_PER_TILEMAP = 4
	settings.use32bitIndex = true

	const pixiApp = new Application({
		antialias: false,
		autoDensity: true,
		autoStart: false,
		backgroundAlpha: 0,
		resolution: window.devicePixelRatio || 1,
	})

	// Scale the stage up 4x.
	pixiApp.stage.setTransform(
		0,
		0,
		3,
		3,
		0,
		0,
		0,
		0,
		0,
	)

	const viewport = new Viewport({ events: pixiApp.renderer.events })

	pixiApp.stage.addChild(viewport)

	store.set(() => ({
		pixiApp,
		viewport,
	}))
}
