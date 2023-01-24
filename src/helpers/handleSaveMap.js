/* eslint-env node */

// Module imports
import path from 'node:path'
import { v4 as uuid } from 'uuid'





// Local imports
import { createArchive } from './createArchive.js'
import { getAppDataPath } from './getAppDataPath.js'
import { STATE } from './state.js'





/**
 * Displays a save dialog, allowing the user to save a tileset to their filesystem.
 *
 * @param {object} event The event object.
 * @param {object} mapData A hash of the new map.
 * @returns {boolean} Whether the file was saved successfully.
 */
export async function handleSaveMap(event, mapData) {
	const filePath = path.join(getAppDataPath(), 'maps', `${mapData.name}.debugmap`)
	const id = mapData.id || uuid()

	const {
		adjustmentX,
		adjustmentY,
		height,
		width,
	} = mapData.layers.reduce((accumulator, layer) => {
		// Loop over all tiles and use their coordinates to determine the minimum and maximum coordinates on the grid.
		const {
			maxX,
			maxY,
			minX,
			minY,
		} = Object.keys(layer).reduce((accumulator, coordinateString) => {
			const [x, y] = coordinateString
				.split('|')
				.map(Number)

			if (accumulator.maxX === null) {
				accumulator.maxX = x
			} else {
				accumulator.maxX = Math.max(accumulator.maxX, x)
			}

			if (accumulator.maxY === null) {
				accumulator.maxY = y
			} else {
				accumulator.maxY = Math.max(accumulator.maxY, y)
			}

			if (accumulator.minX === null) {
				accumulator.minX = x
			} else {
				accumulator.minX = Math.min(accumulator.minX, x)
			}

			if (accumulator.minY === null) {
				accumulator.minY = y
			} else {
				accumulator.minY = Math.min(accumulator.minY, y)
			}

			return accumulator
		}, {
			maxX: null,
			maxY: null,
			minX: null,
			minY: null,
		})

		const layerHeight = (maxY - minY) + 1
		const layerWidth = (maxX - minX) + 1

		if (layerHeight > accumulator.height) {
			accumulator.height = layerHeight
		}

		if (layerWidth > accumulator.width) {
			accumulator.width = layerWidth
		}

		if (accumulator.adjustmentX === null) {
			accumulator.adjustmentX = minX
		} else if (minX < accumulator.adjustmentX) {
			accumulator.adjustmentX = minX
		}

		if (accumulator.adjustmentY === null) {
			accumulator.adjustmentY = minY
		} else if (minY < accumulator.adjustmentY) {
			accumulator.adjustmentY = minY
		}

		return accumulator
	}, {
		adjustmentX: null,
		adjustmentY: null,
		height: 0,
		width: 0,
	})

	const parsedDestinations = Object.keys(mapData.destinations).map(coordinateString => {
		const [x, y] = coordinateString
			.split('|')
			.map(Number)

		return {
			x: x - adjustmentX,
			y: y - adjustmentY,
		}
	})

	// Loop over the layers again to adjust each tile's coordinates, placing the top left of the map at x0, y0.
	const parsedLayers = mapData.layers.map(layer => {
		return Object.entries(layer).reduce((accumulator, [coordinateString, cellData]) => {
			const [x, y] = coordinateString
				.split('|')
				.map(Number)

			accumulator[`${x - adjustmentX}|${y - adjustmentY}`] = cellData

			return accumulator
		}, {})
	})

	const parsedPfgrid = Object.entries(mapData.pfgrid).reduce((accumulator, [coordinateString, cellData]) => {
		const [x, y] = coordinateString
			.split('|')
			.map(Number)

		accumulator[`${x - adjustmentX}|${y - adjustmentY}`] = cellData

		return accumulator
	}, {})

	const parsedStartingPosition = {
		x: mapData.startingPosition.x - adjustmentX,
		y: mapData.startingPosition.y - adjustmentY,
	}

	try {
		await createArchive(filePath, {
			'map.json': JSON.stringify({
				destinations: parsedDestinations,
				dimensions: {
					height: height + 1,
					width: width + 1,
				},
				startingPosition: parsedStartingPosition,
				pfgrid: parsedPfgrid,
				tiles: parsedLayers,
			}),
			'meta.json': JSON.stringify({
				dependencies: mapData.dependencies,
				id,
				name: mapData.name,
				type: 'maps',
				version: '0.0.0-development',
			}),
		})
	} catch (error) {
		// throw new Error(error)
		console.log(error)
		return false
	}

	STATE.contentWatcher.add(filePath)

	return true
}
