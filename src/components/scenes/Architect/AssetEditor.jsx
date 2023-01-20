// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Editor } from './Editor.jsx'
import { useResourcepackEditorContext } from './ResourcepackEditorContext/useResourcepackEditorContext.js'





export function AssetEditor(props) {
	const { assetID } = props
	const { assets } = useResourcepackEditorContext()

	const asset = assets[assetID]

	return (
		<Editor image={asset.image} />
	)
}

AssetEditor.propTypes = {
	assetID: PropTypes.string.isRequired,
}
