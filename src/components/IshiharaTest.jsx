// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'





// Local imports
import { Button } from './Button.jsx'





/**
 * Handles changes to the colorblindType setting.
 *
 * @param {string} value The new value of the colorblindType setting.
 */
 function handleColorblindTypeChange(value) {
	if (value) {
		document.documentElement.setAttribute('data-color-vision-deficiency-type', value)
		document.documentElement.setAttribute('data-color-vision-deficiency-severity', 9)
	} else {
		document.documentElement.removeAttribute('data-color-vision-deficiency-type')
		document.documentElement.removeAttribute('data-color-vision-deficiency-severity')
	}
}





/**
 * Renders Ishihara test plates.
 */
export function IshiharaTest() {
	const [colorblindType, setColorblindType] = useState(null)

	const plateImages = useMemo(() => {
		const result = []

		let index = 1

		while (index < 38) {
			const plateID = index.toString().padStart(2, '0')

			result.push((
				<img
					key={plateID}
					alt={`Ishihara plate ${plateID}`}
					src={`/static/ishihara/${plateID}.jpg`} />
			))
			index += 1
		}

		return result
	}, [])

	useEffect(() => {
		handleColorblindTypeChange(colorblindType)
	}, [colorblindType])

	return (
		<div className={'ishihara-test'}>
			<menu type={'toolbar'}>
				<Button onClick={() => setColorblindType('deuteranomaly')}>
					{'Deuteranomaly'}
				</Button>

				<Button onClick={() => setColorblindType('protanomaly')}>
					{'Protanomaly'}
				</Button>

				<Button onClick={() => setColorblindType('tritanomaly')}>
					{'Tritanomaly'}
				</Button>

				<Button onClick={() => setColorblindType(null)}>
					{'None'}
				</Button>
			</menu>

			<div className={'plates'}>
				{plateImages}
			</div>
		</div>
	)
}
