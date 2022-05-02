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
	assets: {},

	// eslint-disable-next-line jsdoc/require-jsdoc
	addAssets: () => {},
	// eslint-disable-next-line jsdoc/require-jsdoc
	removeAsset: () => {},
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

	const removeAsset = useCallback(assetID => {
		setAssets(oldAssets => {
			const newAssets = { ...oldAssets }

			delete newAssets[assetID]

			return newAssets
		})
	}, [setAssets])

	const providerState = useMemo(() => {
		return {
			addAssets,
			assets,
			removeAsset,
		}
	}, [
		addAssets,
		assets,
		removeAsset,
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
