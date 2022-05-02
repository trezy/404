// Module imports
import {
	useCallback,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





// Local imports
import { Button } from '../../Button.jsx'
import { Modal } from '../../Modal.jsx'





export function NewAssetModal(props) {
	const {
		onClose,
		onAddToProject,
	} = props
	const [files, setFiles] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const handleAddToProject = useCallback(() => onAddToProject(files), [
		files,
		onAddToProject,
	])

	const handleFilenameChange = useCallback(({ target }) => {
		const fileID = target.getAttribute('data-fileid')

		setFiles(oldFiles => {
			oldFiles[fileID].name = target.value
			return { ...oldFiles }
		})
	}, [setFiles])

	const handleFileSelect = useCallback(async({ target }) => {
		setIsLoading(true)

		const promises = Array.from(target.files).map(file => new Promise(resolve => {
			const filereader = new FileReader
			// eslint-disable-next-line jsdoc/require-jsdoc
			filereader.onload = ({ target: { result } }) => {
				const image = new Image
				image.src = result.toString()
				resolve({
					dataURL: result,
					file,
					image,
					isSpritesheet: false,
					name: file.name,
				})
			}
			filereader.readAsDataURL(file)
		}))
		const processedFiles = await Promise.all(promises)
		const filesObject = processedFiles.reduce((accumulator, fileData) => {
			accumulator[uuid()] = fileData
			return accumulator
		}, {})

		setFiles(oldFiles => ({
			...oldFiles,
			...filesObject,
		}))
		setIsLoading(false)
	}, [setFiles])

	const handleRemoveFile = useCallback(({ target }) => {
		setFiles(oldFiles => {
			delete oldFiles[target.getAttribute('data-fileid')]
			return { ...oldFiles }
		})
	}, [setFiles])

	const filesEntries = Object.entries(files)

	return (
		<Modal
			className={'new-assets'}
			isLoading={isLoading}
			onClose={onClose}
			title={'Create New Asset'}>
			{!Object.values(files).length && (
				<div className={'field'}>
					<label>{'Select Files'}</label>
					<input
						accept={'image/*'}
						multiple
						name={'file'}
						onChange={handleFileSelect}
						type={'file'} />
				</div>
			)}

			{Boolean(filesEntries.length) && (
				<>
					<ul className={'asset-previews'}>
						{filesEntries.map(([fileID, fileData]) => (
							<li key={fileID}>
								<img
									alt={''}
									src={fileData.dataURL} />

								<div className={'details'}>
									<div className={'field'}>
										<label htmlFor={`${fileID}-name`}>
											{'Name'}
										</label>

										<input
											data-fileid={fileID}
											id={`${fileID}-name`}
											name={'name'}
											onChange={handleFilenameChange}
											type={'text'}
											value={fileData.name} />
									</div>
								</div>

								<menu type={'toolbar'}>
									<Button
										data-fileid={fileID}
										isNegative
										onClick={handleRemoveFile}>
										{'Remove'}
									</Button>
								</menu>
							</li>
						))}
					</ul>

					<footer>
						<menu type={'toolbar'}>
							<div className={'menu-right'}>
								<Button
									isNegative
									onClick={onClose}>
									{'Cancel'}
								</Button>

								<Button
									isAffirmative
									onClick={handleAddToProject}>
									{'Add to Project'}
								</Button>
							</div>
						</menu>
					</footer>
				</>
			)}
		</Modal>
	)
}

NewAssetModal.propTypes = {
	onAddToProject: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
}
