// Module imports
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from 'react'





// Local imports
import {
	CVD_MATRICES,
	DALTONISATION_MATRICES,
} from '../data/CVD_MATRICES.js'




// Constants
const style = {
	height: 0,
	lineHeight: 0,
	margin: 0,
	padding: 0,
	pointerEvents: 'none',
	position: 'absolute',
	width: 0,

	// height: 500,
	// width: 500,
	// zIndex: 1,
}





/**
 * SVG filters to simulate color vision deficiency.
 */
export function DaltonLensSVG() {
	const [cvdSeverity, setCVDSeverity] = useState(null)
	const [cvdType, setCVDType] = useState(null)

	const filters = useMemo(() => {
		if (!cvdType || !cvdSeverity) {
			return null
		}

		const cvdMatrix = CVD_MATRICES[cvdType][cvdSeverity]
		const daltonisationMatrix = DALTONISATION_MATRICES[cvdType]

		return (
			<Fragment key={cvdType}>
				<filter
					colorInterpolationFilters={'linearRGB'}
					id={`${cvdType}-simulation`} >
					<feColorMatrix
						in={'SourceGraphic'}
						result={`${cvdType}-simulation`}
						type={'matrix'}
						values={cvdMatrix} />
				</filter>

				<filter
					colorInterpolationFilters={'linearRGB'}
					id={`${cvdType}-daltonisation`} >
					<feColorMatrix
						in={`${cvdType}-simulation`}
						result={`${cvdType}-daltonised`}
						type={'matrix'}
						values={daltonisationMatrix} />
				</filter>

				<filter
					colorInterpolationFilters={'linearRGB'}
					id={`${cvdType}-daltonisation-with-simulation`} >
					<feColorMatrix
						in={`${cvdType}-daltonised`}
						type={'matrix'}
						values={cvdMatrix} />
				</filter>
			</Fragment>
		)
	}, [
		cvdSeverity,
		cvdType,
	])

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setCVDSeverity(Number(document.documentElement.getAttribute('data-color-vision-deficiency-severity')))
			setCVDType(document.documentElement.getAttribute('data-color-vision-deficiency-type'))
		})

		observer.observe(document.documentElement, { attributes: true })

		return () => observer.disconnect()
	}, [
		setCVDSeverity,
		setCVDType,
	])

	return (
		<svg style={style}>
			<defs>
				<linearGradient
					gradientUnits={'userSpaceOnUse'}
					id={'rainbow'}
					x1={'0'}
					x2={'100%'}
					y1={'0'}
					y2={'0'}>
					<stop
						offset={'0'}
						stopColor={'#ff0000'} />
					<stop
						offset={'0.2'}
						stopColor={'#ffff00'} />
					<stop
						offset={'0.4'}
						stopColor={'#00ff00'} />
					<stop
						offset={'0.6'}
						stopColor={'#00ffff'} />
					<stop
						offset={'0.8'}
						stopColor={'#0000ff'} />
					<stop
						offset={'1'}
						stopColor={'#800080'} />
				</linearGradient>

				{filters}
			</defs>

			<g
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				style={{
					// filter: 'url(#deuteranopia)',
					// filter: 'url(#deuteranopia-daltonisation)',
					// filter: 'url(#protanopia)',
					// filter: 'url(#protanopia-daltonisation)',
				}}>
				<rect
					// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
					style={{
						fill: 'url(#rainbow)',
						height: '20px',
						width: 'calc(100% - 40px)',
					}}
					x={20}
					y={30} />

				<image
					// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
					style={{
						height: '500px',
						width: 'calc(100% - 40px)',
					}}
					x={20}
					xlinkHref={'/static/fall_trees.jpg'}
					y={30} />
			</g>
		</svg>
	)

	return (
		<svg style={style}>
			<defs>
				{filters}

				<linearGradient
					gradientUnits={'userSpaceOnUse'}
					id={'rainbow'}
					x1={'0'}
					x2={'100%'}
					y1={'0'}
					y2={'0'}>
					<stop
						offset={'0'}
						stopColor={'#ff0000'} />
					<stop
						offset={'0.2'}
						stopColor={'#ffff00'} />
					<stop
						offset={'0.4'}
						stopColor={'#00ff00'} />
					<stop
						offset={'0.6'}
						stopColor={'#00ffff'} />
					<stop
						offset={'0.8'}
						stopColor={'#0000ff'} />
					<stop
						offset={'1'}
						stopColor={'#800080'} />
				</linearGradient>

				{/* Single matrix approximation of Viénot, Brettel & Mollon 1999 */}
				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'deuteranopia'} >
					<feColorMatrix
						in={'SourceGraphic'}
						result={'DeuteranopiaFilter'}
						type={'matrix'}
						values={deuteranopiaFilterValues} />
						{/* values={CVD_MATRICES.deuteranomaly[9]} /> */}
				</filter>

				{/* Single matrix approximation of Viénot, Brettel & Mollon 1999 */}
				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'protanopia'}>
					<feColorMatrix
						in={'SourceGraphic'}
						result={'ProtanopiaFilter'}
						type={'matrix'}
						values={protanopiaFilterValues} />
				</filter>

				{/*
					Brettel, Viénot & Mollon 1997 algorithms with two projection planes.

					This is the only approach I know that is supposed to be reasonably
					accurate for tritanopia, the single matrix approaches are NOT accurate.
				*/}
				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'tritanopia'}>
					{/*
						Projection 1, with a special alpha that encodes the separation plane.
						If dot(rgb, n) > 0, then use projection 1, otherwise use projection 2.
						This is encoded in alpha by:
						- Applying a 1.0 factor on the source alpha so that 0 input alpha remains 0
						- Subtracting 0.2 so that negative values become < 0.8 and position values >= 0.8
						- It is important to normalize the factors to keep a good numerical accuracy
							and to keep a large alpha threshold since the RGB values are then stored
							premultiplied by alpha.
						- This assumes that negative values get clipped to 0, and positive
							values clipped to 1, without overflowing, etc. Which seems to be the case
							on all browsers.
					*/}
					<feColorMatrix
						in={'SourceGraphic'}
						result={'ProjectionOnPlane1'}
						type={'matrix'}
						values={tritanopiaMatrixValues1} />

					{/*
						Binarize alpha. 5 values means the last chunk will start at 0.8.
						All the values below 0.8 will become 0 (correspond to the dot
						product with the separation plane being negative) and above will become 1
					*/}
					<feComponentTransfer
						in={'ProjectionOnPlane1'}
						result={'ProjectionOnPlane1'}>
						<feFuncA
							tableValues={'0 0 0 0 1'}
							type={'discrete'} />
					</feComponentTransfer>
					<feColorMatrix
						in={'SourceGraphic'}
						result={'ProjectionOnPlane2'}
						type={'matrix'}
						values={tritanopiaMatrixValues2} />

					{/* Blend the two projections, picking one or the other depending on alpha. */}
					<feBlend
						in={'ProjectionOnPlane1'}
						in2={'ProjectionOnPlane2'}
						mode={'normal'}
						result={'TritanopiaFilter'} />
				</filter>

				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'deuteranopia-daltonisation'}>
					<feColorMatrix
						in={'DeuteranopiaFilter'}
						result={'DeuteranopiaDaltonised'}
						type={'matrix'}
						values={deuteranopiaDaltonisationMatrixValues} />
					{/* <feColorMatrix
						in={'DeuteranopiaDaltonised'}
						type={'matrix'}
						values={deuteranopiaFilterValues} /> */}
				</filter>

				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'protanopia-daltonisation'}>
					<feColorMatrix
						in={'ProtanopiaFilter'}
						result={'ProtanopiaDaltonised'}
						type={'matrix'}
						values={protanopiaDaltonisationMatrixValues} />
					{/* <feColorMatrix
						in={'ProtanopiaDaltonised'}
						type={'matrix'}
						values={protanopiaFilterValues} /> */}
					{/* <feBlend
						in={'SourceGraphic'}
						in2={'ProtanopiaFilter'}
						// mode={'color'}
						// mode={'color-burn'}
						// mode={'color-dodge'}
						// mode={'darken'}
						// mode={'difference'}
						// mode={'exclusion'}
						// mode={'hard-light'}
						// mode={'hue'}
						// mode={'lighten'}
						// mode={'luminosity'}
						// mode={'multiply'}
						// mode={'overlay'}
						// mode={'saturation'}
						// mode={'screen'}
						// mode={'soft-light'}
						result={'ErrorMatrix'} /> */}
					{/* <feColorMatrix
						in={'ErrorMatrix'}
						result={'CompensationMatrix'}
						type={'matrix'}
						values={daltonisationMatrixValues} /> */}
					{/* <feBlend
						in={'SourceGraphic'}
						in2={'CompensationMatrix'}
						// mode={'color'}
						// mode={'color-burn'}
						// mode={'color-dodge'}
						// mode={'darken'}
						// mode={'difference'}
						// mode={'exclusion'}
						// mode={'hard-light'}
						// mode={'hue'}
						// mode={'lighten'}
						// mode={'luminosity'}
						// mode={'multiply'}
						// mode={'overlay'}
						// mode={'saturation'}
						mode={'screen'}
						// mode={'soft-light'}
						result={'ErrorMatrix'} /> */}
				</filter>

				<filter
					colorInterpolationFilters={'linearRGB'}
					id={'tritanopia-daltonisation'}>
					<feColorMatrix
						in={'TritanopiaFilter'}
						result={'TritanopiaDaltonised'}
						type={'matrix'}
						values={tritanopiaDaltonisationMatrixValues} />
					{/* <feColorMatrix
						in={'TritanopiaDaltonised'}
						type={'matrix'}
						values={tritanopiaFilterValues} /> */}
				</filter>
			</defs>

			<g
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				style={{
					filter: 'url(#deuteranopia)',
					// filter: 'url(#deuteranopia-daltonisation)',
					// filter: 'url(#protanopia)',
					// filter: 'url(#protanopia-daltonisation)',
				}}>
				<rect
					// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
					style={{
						fill: 'url(#rainbow)',
						height: '20px',
						width: 'calc(100% - 40px)',
					}}
					x={20}
					y={30} />

				<image
					// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
					style={{
						height: '500px',
						width: 'calc(100% - 40px)',
					}}
					x={20}
					xlinkHref={'/static/fall_trees.jpg'}
					y={30} />
			</g>
		</svg>
	)
}
