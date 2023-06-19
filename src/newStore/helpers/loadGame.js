// Local imports
import { executePromiseWithMinimumDuration } from '../../helpers/executePromiseWithMinimumDuration.js'
import { initialiseFilesystem } from './initialiseFilesystem.js'
import { loadGameAssets } from '../../helpers/loadGameAssets.js'
import { setupPixiApp } from './setupPixiApp.js'
import { store } from '../store.js'





// Constants
const MINIMUM_DURATION = 2000





export async function loadGame() {
	const {
		areAssetsLoaded,
		isFilesystemInitialised,
		pixiApp,
	} = store.state

	if (!isFilesystemInitialised) {
		store.set(() => ({ isInitialisingFilesystem: true }))
		await executePromiseWithMinimumDuration(initialiseFilesystem(), MINIMUM_DURATION)
		store.set(() => ({ isInitialisingFilesystem: false }))
	}

	if (!pixiApp) {
		store.set(() => ({ isSettingUpPixi: true }))
		await executePromiseWithMinimumDuration(async () => setupPixiApp(), MINIMUM_DURATION)
		store.set(() => ({ isSettingUpPixi: false }))
	}

	if (!areAssetsLoaded) {
		store.set(() => ({ isLoadingAssets: true }))
		await executePromiseWithMinimumDuration(loadGameAssets(), MINIMUM_DURATION)
		store.set(() => ({ isLoadingAssets: false }))
	}

	store.state.controlsManager.start()
}
