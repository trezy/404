// Module imports
import ConfigStore from 'electron-store'





// Local imports
import { ACTIONS } from '../game/ACTIONS.js'





// Variables
export const configStore = new ConfigStore({
	defaults: {
		settings: {
			accessibility: {
				colorblindType: 'none',
				headingFontFace: 'Thaleah',
				textFontFace: 'Awkward',
				usePixelFonts: true,
			},

			controls: [
				{
					label: ACTIONS.MOVE_CURSOR_RIGHT,
					mappings: {
						keyboard: {
							primary: ['KeyD'],
							secondary: ['ArrowRight'],
						},
					},
					repeatFrequency: 150,
				},

				{
					label: ACTIONS.MOVE_CURSOR_UP,
					mappings: {
						keyboard: {
							primary: ['KeyW'],
							secondary: ['ArrowUp'],
						},
					},
					repeatFrequency: 150,
				},

				{
					label: ACTIONS.MOVE_CURSOR_DOWN,
					mappings: {
						keyboard: {
							primary: ['KeyS'],
							secondary: ['ArrowDown'],
						},
					},
					repeatFrequency: 150,
				},

				{
					label: ACTIONS.MOVE_CURSOR_LEFT,
					mappings: {
						keyboard: {
							primary: ['KeyA'],
							secondary: ['ArrowLeft'],
						},
					},
					repeatFrequency: 150,
				},

				{
					label: ACTIONS.PLACE_TILESET,
					mappings: {
						keyboard: {
							primary: ['Space'],
							secondary: [],
						},
					},
				},

				{
					label: ACTIONS.SKIP_TIMER,
					mappings: {
						keyboard: {
							primary: ['Enter'],
							secondary: [],
						},
					},
				},
			],

			graphics: {
				displayMode: 'windowed',
				displayResolution: {
					height: 0,
					screenRefreshRate: 60,
					width: 0,
				},
			},

			sound: {
				effectsVolume: 100,
				musicVolume: 100,
				volume: 100,
			},

			system: {
				showBattery: true,
				showClock: true,
				showCPUTemperature: true,
				showCPUUsage: true,
				showDebuggingPanel: false,
				showFramerate: true,
				showGPUTemperature: true,
				showGPUUsage: true,
				showVRAMTemperature: true,
				showVRAMUsage: true,
				showRAMUsage: true,
			},
		},
	},
	schema: {
		settings: {
			type: 'object',
			properties: {
				accessibility: {
					type: 'object',
					properties: {
						colorblindType: {
							enum: [
								'none',
								'deuteranopia',
								'protanopia',
								'tritanopia',
							],
						},
						headingFontFace: { type: 'string' },
						textFontFace: { type: 'string' },
						usePixelFonts: { type: 'boolean' },
					},
				},

				controls: {
					type: 'array',
					minItems: 1,
					items: {
						type: 'object',
						properties: {
							mappings: { type: 'object' },
							label: { type: 'string' },
							repeatFrequency: { type: 'number' },
						},
					},
				},

				graphics: {
					type: 'object',
					properties: {
						displayMode: {
							enum: [
								'fullscreen',
								'windowed',
								'fullscreen extended window',
							],
						},
						displayResolution: {
							type: 'object',
							properties: {
								width: { type: 'number' },
								height: { type: 'number' },
							},
						},
						pixelScale: {
							minimum: 1,
							type: 'number',
						},
						preferredDisplay: {
							default: 'primary',
							type: 'string',
						},
						screenRefreshRate: {
							enum: [
								30,
								60,
							],
						},
					},
				},

				sound: {
					type: 'object',
					properties: {
						effectsVolume: {
							maximum: 100,
							minimum: 0,
							type: 'number',
						},
						musicVolume: {
							maximum: 100,
							minimum: 0,
							type: 'number',
						},
						volume: {
							maximum: 100,
							minimum: 0,
							type: 'number',
						},
					},
				},

				system: {
					type: 'object',
					properties: {
						showBattery: { type: 'boolean' },
						showClock: { type: 'boolean' },
						showCPUTemperature: { type: 'boolean' },
						showCPUUsage: { type: 'boolean' },
						showDebuggingPanel: { type: 'boolean' },
						showFramerate: { type: 'boolean' },
						showGPUTemperature: { type: 'boolean' },
						showGPUUsage: { type: 'boolean' },
						showVRAMTemperature: { type: 'boolean' },
						showVRAMUsage: { type: 'boolean' },
						showRAMUsage: { type: 'boolean' },
					},
				},
			},
		},
	},
	watch: true,
})
