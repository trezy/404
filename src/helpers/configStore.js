// Module imports
import ConfigStore from 'electron-store'





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
					bindings: {},
					inputID: 'keyboard/mouse',
					inputType: 'keyboard/mouse',
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
							bindings: {
								type: 'object',
								properties: {
								},
							},
							inputID: { type: 'string' },
							inputType: { type: 'string' },
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
