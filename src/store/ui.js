// Module imports
import create from 'zustand/vanilla'
import createForReact from 'zustand'





// Local imports
import { store } from './index.js'





export const uiStore = create(set => ({
	titleState: {
		isCampaignMenuVisible: true,
		isCustomGameMenuVisible: false,

		/**
		 * Resets the state to its initial value.
		 */
		reset() {
			set(previousState => {
				return {
					titleState: {
						...previousState.titleState,
						isCampaignMenuVisible: true,
						isCustomGameMenuVisible: false,
					},
				}
			})
		},

		/**
		 * Shows the campaign menu.
		 */
		showCampaignMenu() {
			set(previousState => {
				return {
					titleState: {
						...previousState.titleState,
						isCampaignMenuVisible: true,
						isCustomGameMenuVisible: false,
					},
				}
			})
		},

		/**
		 * Shows the custom game menu.
		 */
		showCustomGameMenu() {
			set(previousState => {
				return {
					titleState: {
						...previousState.titleState,
						isCampaignMenuVisible: false,
						isCustomGameMenuVisible: true,
					},
				}
			})
		},
	},
}))

store.subscribe(state => state.scene, () => {
	uiStore.getState().titleState.reset()
})

export const useUIStore = createForReact(uiStore)
