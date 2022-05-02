// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'





export const AssetsContext = createContext({
	// eslint-disable-next-line jsdoc/require-jsdoc
	addAssets: () => {},
	assets: {},
})





export function AssetsContextProvider(props) {
	const { children } = props

	const [assets, setAssets] = useState({})

	const addAssets = useCallback(newAssets => {
		setAssets(oldAssets => ({
			...oldAssets,
			...newAssets,
		}))
	}, [setAssets])

	const providerState = useMemo(() => {
		return {
			addAssets,
			assets,
		}
	}, [
		addAssets,
		assets,
	])

	return (
		<AssetsContext.Provider
			value={providerState}>
			{children}
		</AssetsContext.Provider>
	)
}

AssetsContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}





// eslint-disable-next-line jsdoc/require-jsdoc
export const useAssets = () => useContext(AssetsContext)
