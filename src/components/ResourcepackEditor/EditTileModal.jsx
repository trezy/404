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
import { Button } from '../Button.jsx'
import { Input } from '../Input.jsx'
import { Modal } from '../Modal/Modal.jsx'
import { useEditorContext } from '../Editor/Context/useEditorContext.js'
import { useResourcepackEditorContext } from './Context/useResourcepackEditorContext.js'





/**
 * Renders a modal for creating or editing a tile.
 *
 * @param {*} props
 */
export function EditTileModal(props) {
	const {
		onClose,
		onAddToProject,
		tileID,
	} = props

	const { tiles } = useResourcepackEditorContext()
	const {
		focusedItemID,
		openItems,
		scale,
		selection,
	} = useEditorContext()

	const [tileName, setTileName] = useState(tileID ? tiles[tileID].name : '')

	const canvasRef = useRef(null)

	const focusedItem = useMemo(() => {
		return openItems[focusedItemID].item
	}, [
		focusedItemID,
		openItems,
	])

	const tile = useMemo(() => {
		if (tileID) {
			return tiles[tileID]
		}

		return null
	}, [
		tileID,
		tiles,
	])

	const tileSize = useMemo(() => {
		let height = selection?.height || 0
		let width = selection?.width || 0

		if (tile) {
			height = tile.height
			width = tile.width
		}

		return {
			height,
			width,
		}
	}, [
		scale,
		selection,
		tile,
	])

	const handleSubmit = useCallback(event => {
		event.preventDefault()

		const tileObject = {
			...(tile || {}),
			name: tileName,
			tileID,
		}

		if (!tile) {
			const canvasElement = canvasRef.current

			tileObject.dataURI = canvasElement.toDataURL()
			tileObject.height = selection.height
			tileObject.width = selection.width
		}

		onAddToProject(tileObject)
		onClose()
	}, [
		onAddToProject,
		onClose,
		scale,
		selection,
		tile,
		tileID,
		tileName,
	])

	const handleTileNameChange = useCallback(event => {
		setTileName(event.target.value)
	}, [setTileName])

	useEffect(() => {
		if (tile) {
			return
		}

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
				selection.width * scale,
				selection.height * scale,
				0,
				0,
				selection.width * scale,
				selection.height * scale,
			)
		}
	}, [
		focusedItem,
		onClose,
		scale,
		selection,
		tile,
	])

	return (
		<Modal
			className={'new-tile'}
			onClose={onClose}
			title={tile ? 'Edit Tile' : 'Create New Tile'}>
			<figure>
				{Boolean(tile) && (
					<img
						alt={tile.name}
						height={tileSize.height * scale}
						src={tile.dataURI}
						width={tileSize.width * scale} />
				)}

				{!tile && (
					<canvas
						ref={canvasRef}
						height={tileSize.height * scale}
						width={tileSize.width * scale} />
				)}
			</figure>

			<form onSubmit={handleSubmit}>
				<div className={'form-contents'}>
					<div className={'field'}>
						<label htmlFor={'new-tile-name'}>
							{'Name'}
						</label>

						<Input
							onChange={handleTileNameChange}
							type={'text'}
							value={tileName} />
					</div>

					<div className={'field'}>
						<label>
							{'Width'}
						</label>

						<Input
							readOnly
							type={'text'}
							value={`${tileSize.width}px`} />
					</div>

					<div className={'field'}>
						<label>
							{'Height'}
						</label>

						<Input
							readOnly
							type={'text'}
							value={`${tileSize.height}px`} />
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
								isSubmit>
								{!tileID && 'Create Tile'}
								{Boolean(tileID) && 'Update Tile'}
							</Button>
						</div>
					</menu>
				</footer>
			</form>
		</Modal>
	)
}

EditTileModal.defaultProps = {
	tileID: null,
}

EditTileModal.propTypes = {
	onAddToProject: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	tileID: PropTypes.string,
}
