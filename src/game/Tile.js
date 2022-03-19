export const TILE_SIZE = {
	height: 16,
	width: 16,
}

export function renderStandardSizeTile(config) {
	const {
		destinationX,
		destinationY,
		renderer,
		sourceX,
		sourceY,
		tileset,
	} = config

	renderer.drawImage({
		image: tileset,
		source: {
			height: TILE_SIZE.height,
			width: TILE_SIZE.width,
			x: sourceX,
			y: sourceY,
		},
		destination: {
			height: TILE_SIZE.height,
			width: TILE_SIZE.width,
			x: destinationX,
			y: destinationY,
		},
	})
}

export const TILE_RENDERERS = [
	// 0 = empty
	() => {},

	// 1 = wall w/ face
	config => {
		renderStandardSizeTile({
			...config,
			sourceX: 144,
			sourceY: 48,
		})

		config.renderer.setAlpha(0.5)
		renderStandardSizeTile({
			...config,
			destinationY: config.destinationY + TILE_SIZE.height,
			sourceX: 16,
			sourceY: 176,
		})
		config.renderer.setAlpha(1)
	},

	// 2 = wall w/ face, adjacent top
	config => {
		renderStandardSizeTile({
			...config,
			sourceX: 112,
			sourceY: 48,
		})

		config.renderer.setAlpha(0.5)
		renderStandardSizeTile({
			...config,
			destinationY: config.destinationY + TILE_SIZE.height,
			sourceX: 16,
			sourceY: 176,
		})
		config.renderer.setAlpha(1)
	},

	// 3 = wall top
	config => renderStandardSizeTile({
		...config,
		sourceX: 144,
		sourceY: 16,
	}),

	// 4 = wall top, adjacent top
	config => renderStandardSizeTile({
		...config,
		sourceX: 112,
		sourceY: 16,
	}),

	// 5 = floor
	config => renderStandardSizeTile({
		...config,
		sourceX: 112,
		sourceY: 176,
	}),
]
