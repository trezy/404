// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import PropTypes from 'prop-types'
// import { v4 as uuid } from 'uuid'





// Local imports
import { Button } from '../../Button.jsx'
import { Modal } from '../../Modal.jsx'
import { useEditor } from './context/EditorContext.jsx'





export function NewTileModal(props) {
	const {
		onClose,
		onAddToProject,
	} = props

	const {
		focusedItemID,
		openItems,
		scale,
		selection,
	} = useEditor()

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

	useEffect(() => {
		if (canvasRef.current) {
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
					height={selection.height * scale}
					width={selection.width * scale} />
			</figure>

			<dl>
				<dt>{'Width:'}</dt>
				<dd>{`${selection.width}px`}</dd>

				<dt>{'Height:'}</dt>
				<dd>{`${selection.height}px`}</dd>
			</dl>

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
		</Modal>
	)
}

NewTileModal.propTypes = {
	onAddToProject: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
}
