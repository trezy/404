// Module imports
import PropTypes from 'prop-types'





// Local imports
import { useNavGraphNode } from './NavGraphContextProvider.jsx'





export function NavGraphNode(props) {
	const {
		children,
		groupID,
		id,
		isDefault,
		groupLinks,
		onActivate,
		onDeactivate,
		onFocus,
		targetRef,
	} = props

	useNavGraphNode({
		groupID,
		id,
		isDefault,
		groupLinks,
		onActivate,
		onDeactivate,
		onFocus,
		targetRef,
	}, [
		groupID,
		id,
		isDefault,
		groupLinks,
		onActivate,
		onDeactivate,
		onFocus,
		targetRef,
	])

	return children
}

NavGraphNode.defaultProps = {
	children: null,
	groupLinks: [],
	isDefault: false,
	onFocus: PropTypes.func,
}

NavGraphNode.propTypes = {
	children: PropTypes.node,
	groupID: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	isDefault: PropTypes.bool,
	groupLinks: PropTypes.arrayOf(PropTypes.string),
	onActivate: PropTypes.func.isRequired,
	onDeactivate: PropTypes.func,
	onFocus: PropTypes.func,
	targetRef: PropTypes.object.isRequired,
}
