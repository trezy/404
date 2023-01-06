// Module imports
import archiver from 'archiver'
import { Buffer } from 'node:buffer'
import { createWriteStream } from 'node:fs'





/**
 * Creates a gzip archive from the passed arguments.
 *
 * @param {string} destination Absolute path where the archive should be written.
 * @param {object} archiveContents A hash of the contents to inject into the new archive.
 * @returns {Promise<null>} A promise that resolves when the archive is finished writing.
 */
export function createArchive(destination, archiveContents) {
	return new Promise((resolve, reject) => {
		const result = { size: 0 }

		const archive = archiver('zip', {
			zlib: {
				level: 9,
			},
		})

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const output = createWriteStream(destination)

		output.on('close', () => {
			result.size = archive.pointer()
			resolve(result)
		})

		archive.on('error', reject)

		archive.pipe(output)

		Object.entries(archiveContents).forEach(([name, fileContents]) => {
			archive.append(
				Buffer.from(fileContents),
				{ name },
			)
		})

		archive.finalize()
	})
}
