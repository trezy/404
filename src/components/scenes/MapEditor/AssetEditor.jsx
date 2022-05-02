// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Editor } from './Editor.jsx'
import { useAssets } from './context/AssetsContext.jsx'





export function AssetEditor(props) {
	const { assetID } = props
	const { assets } = useAssets()

	const asset = assets[assetID]

	return (
		<Editor image={asset.image} />
	)
}

AssetEditor.propTypes = {
	assetID: PropTypes.string.isRequired,
}
