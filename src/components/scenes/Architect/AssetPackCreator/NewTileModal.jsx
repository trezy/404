// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'
// import { v4 as uuid } from 'uuid'





// Local imports
import { Button } from '../../../Button.jsx'
import { Input } from '../../../Input.jsx'
import { Modal } from '../../../Modal.jsx'
import { useAssets } from '../context/AssetsContext.jsx'
import { useEditor } from '../context/EditorContext.jsx'





export function NewTileModal(props) {
	const {
		onClose,
		onAddToProject,
	} = props

	const { addTile } = useAssets()
	const {
		focusedItemID,
		openItems,
		scale,
		selection,
	} = useEditor()

	const [tileName, setTileName] = useState('')

	const canvasRef = useRef(null)

	const focusedItem = useMemo(() => {
		return openItems[focusedItemID].item
	}, [
		focusedItemID,
		openItems,
	])

	const handleAddToProject = useCallback(() => {
		onAddToProject()
	}, [onAddToProject])

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		const canvasElement = canvasRef.current

		addTile({
			assetID: focusedItemID,
			dataURI: canvasElement.toDataURL(),
			name: tileName,
			height: selection.height,
			width: selection.width,
		})

		onClose()
	}, [
		addTile,
		focusedItemID,
		onClose,
		selection,
		tileName,
	])

	const handleTileNameChange = useCallback(event => {
		setTileName(event.target.value)
	}, [setTileName])

	useEffect(() => {
		if (!selection) {
			onClose()
		} else if (canvasRef.current) {
			const context = canvasRef.current.getContext('2d')

			context.imageSmoothingEnabled = false
			context.setTransform(
				scale,
				0,
				0,
				scale,
				0,
				0,
			)
			context.drawImage(
				focusedItem.image,
				selection.x,
				selection.y,
				selection.width,
				selection.height,
				0,
				0,
				selection.width,
				selection.height,
			)
		}
	}, [
		focusedItem,
		onClose,
		scale,
		selection,
	])

	return (
		<Modal
			className={'new-tile'}
			onClose={onClose}
			title={'Create New Tile'}>
			<figure>
				<canvas
					ref={canvasRef}
					height={(selection?.height || 0) * scale}
					width={(selection?.width || 0) * scale} />
			</figure>

			<form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label>
							{'Width'}
						</label>

						<Input
							readOnly
							type={'text'}
							value={`${selection?.width || 0}px`} />
					</div>

					<div className={'field'}>
						<label>
							{'Height'}
						</label>

						<Input
							readOnly
							type={'text'}
							value={`${selection?.height || 0}px`} />
					</div>

					<div className={'field'}>
						<label htmlFor={'new-tile-name'}>
							{'Name'}
						</label>

						<Input
							id={'new-tile-name'}
							name={'name'}
							onChange={handleTileNameChange}
							value={tileName} />
					</div>
				</div>

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
								isSubmit
								onClick={handleAddToProject}>
								{'Create Tile'}
							</Button>
						</div>
					</menu>
				</footer>
			</form>
		</Modal>
	)
}

NewTileModal.propTypes = {
	onAddToProject: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
}
