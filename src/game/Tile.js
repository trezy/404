export const TILE_SIZE = {
	height: 16,
	width: 16,
}

function renderStandardSizeTile(config) {
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
	// empty
	() => {},

	// wall
	(rendererConfig, tileConfig) => {
		const {
			destinationY,
			renderer,
		} = rendererConfig

		let sourceX = 144
		let sourceY = 48

		switch (tileConfig.grouping) {
			case 'down':
				sourceY = 16
				break

			case 'up':
				sourceX = 112
				break

			case 'vertical':
				sourceX = 112
				sourceY = 16
				break
		}

		renderStandardSizeTile({
			...rendererConfig,
			sourceX,
			sourceY,
		})

		renderer.setAlpha(0.5)
		renderStandardSizeTile({
			...rendererConfig,
			destinationY: destinationY + TILE_SIZE.height,
			sourceX: 16,
			sourceY: 176,
		})
		renderer.setAlpha(1)
	},

	// floor
	(rendererConfig, tileConfig) => {
		const {
			color,
			fade = false,
		} = tileConfig
		const baseX = 48
		const baseY = 176

		let xMod = 0
		let yMod = 0

		switch(color) {
			case 'dark grey':
				xMod += 2
				break

			case 'green':
				xMod += 3
				break

			case 'hazard':
				xMod += 5
				break

			case 'grey':
				xMod += 1
				break

			case 'orange':
				xMod += 8
				break

			case 'red':
				xMod += 6
				break

			// blue
			default:
				xMod = 0
		}

		switch(fade) {
			case 'down':
				yMod = 2
				break

			case 'left':
				yMod = 1
				break

			case 'right':
				yMod = 3
				break

			case 'up':
				yMod = 4
				break

			// no fade
			default:
				yMod = 0
		}

		renderStandardSizeTile({
			...rendererConfig,
			sourceX: baseX + (xMod * TILE_SIZE.width * 2),
			sourceY: baseY + (yMod * TILE_SIZE.height * 2),
		})
	},
]

export class Tile {
	hasShadow = {}
	tileConfig = {}
	tileType = 'empty'

	color(color) {
		this.tileConfig.color = color
		return this
	}

	fade(fadeDirection) {
		this.tileConfig.fade = fadeDirection
		return this
	}

	floor() {
		this.tileType = 'floor'
		return this
	}

	compile() {
		if (Object.keys(this.tileConfig).length) {
			return [
				this.rendererIndex,
				this.tileConfig,
			]
		}

		return this.rendererIndex
	}

	group(grouping) {
		if (this.tileType !== 'wall') {
			throw new Error('Tile.group() method is only allowed for walls')
		}

		this.tileConfig.grouping = grouping

		return this
	}

	wall() {
		this.tileType = 'wall'
		return this
	}

	get rendererIndex() {
		switch (this.tileType) {
			case 'wall':
				return 1

			case 'floor':
				return 2

			default:
				return 0
		}
	}
}
