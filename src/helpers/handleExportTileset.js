/* eslint-env node */

// Module imports
import archiver from 'archiver'
import { createWriteStream } from 'node:fs'
import { dialog } from 'electron'





/**
 * Displays a save dialog, allowing the user to save a tileset to their filesystem.
 *
 * @param {object} event The event object.
 * @param {object} tilesetData A hash of the new tileset.
 * @returns {boolean} Whether the file was saved successfully.
 */
export async function handleExportTileset(event, tilesetData) {
	const { filePath } = await dialog.showSaveDialog({
		defaultPath: `${tilesetData.name}.debugresourcepack`,
		properties: [
			'createDirectory',
			'dontAddToRecent',
			'showOverwriteConfirmation',
		],
		title: 'Save Tileset',
	})

	const result = {
		filePath,
		size: 0,
	}

	if (!filePath) {
		return false
	}

	await new Promise((resolve, reject) => {
		const archive = archiver('zip', {
			zlib: {
				level: 9,
			},
		})

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const output = createWriteStream(filePath)

		output.on('close', () => {
			result.size = archive.pointer()
			resolve(result)
		})

		archive.on('error', reject)

		archive.pipe(output)

		archive.append(
			Buffer.from(JSON.stringify({
				name: tilesetData.name,
				version: '0.0.0-development',
			})),
			{ name: 'meta.json' },
		)
		archive.append(
			Buffer.from(JSON.stringify(tilesetData.assets)),
			{ name: 'assets.json' },
		)
		archive.append(
			Buffer.from(JSON.stringify(tilesetData.tiles)),
			{ name: 'tiles.json' },
		)

		archive.finalize()
	})

	return Boolean(result)
}
