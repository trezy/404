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
		dimensions,
		parsedLayers,
	} = mapData.layers.reduce((accumulator, layer) => {
		// Loop over all tiles and use their coordinates to determine the minimum and maximum coordinates on the grid.
		Object.keys(layer).forEach(coordinateString => {
			const [x, y] = coordinateString
				.split('|')
				.map(Number)

			if (accumulator.dimensions.maxX === null) {
				accumulator.dimensions.maxX = x
			} else {
				accumulator.dimensions.maxX = Math.max(accumulator.dimensions.maxX, x)
			}

			if (accumulator.dimensions.maxY === null) {
				accumulator.dimensions.maxY = y
			} else {
				accumulator.dimensions.maxY = Math.max(accumulator.dimensions.maxY, y)
			}

			if (accumulator.dimensions.minX === null) {
				accumulator.dimensions.minX = x
			} else {
				accumulator.dimensions.minX = Math.min(accumulator.dimensions.minX, x)
			}

			if (accumulator.dimensions.minY === null) {
				accumulator.dimensions.minY = y
			} else {
				accumulator.dimensions.minY = Math.min(accumulator.dimensions.minY, y)
			}
		})

		// The number of cells (as well as direction) the map must be adjusted to have the top left corner at x0, y0.
		const adjustmentX = accumulator.dimensions.minX
		const adjustmentY = accumulator.dimensions.minY

		// Calculate the total height and width of the map.
		accumulator.dimensions.height = (accumulator.dimensions.maxY - accumulator.dimensions.minY) + 1
		accumulator.dimensions.width = (accumulator.dimensions.maxX - accumulator.dimensions.minX) + 1

		// Loop over the layers again to adjust their coordinates, placing the top left of the map at x0, y0.
		const parsedLayer = Object.entries(layer).reduce((layerAccumulator, [coordinateString, layerData]) => {
			const [x, y] = coordinateString
				.split('|')
				.map(Number)

			layerAccumulator[`${x - adjustmentX}|${y - adjustmentY}`] = layerData
			return layerAccumulator
		}, {})

		accumulator.parsedLayers.push(parsedLayer)

		return accumulator
	}, {
		dimensions: {
			height: null,
			maxX: null,
			maxY: null,
			minX: null,
			minY: null,
			width: null,
		},
		parsedLayers: [],
	})

	try {
		await createArchive(filePath, {
			'map.json': JSON.stringify({
				dimensions: {
					height: dimensions.height,
					width: dimensions.width,
				},
				startingPosition: mapData.startingPosition,
				pfgrid: mapData.pfgrid,
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
