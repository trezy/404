/* eslint-disable react/forbid-elements */
// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { motion } from 'framer-motion'





// Local imports
import { TILE_SIZE } from '../game/Tile.js'
import { useRafael } from '../hooks/useRafael.js'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





/**
 * Renders the map editor.
 */
export function MapEditor() {
	const canvasRef = useRef(null)

	const [cursorPosition, setCursorPosition] = useState({
		x: 0,
		y: 0,
	})

	const handleMouseMove = useCallback(event => {
		const canvas = canvasRef.current

		const uiScale = Number(getComputedStyle(canvas).getPropertyValue('--ui-scale'))

		const x = Math.floor((event.pageX - event.target.offsetLeft) / uiScale)
		const y = Math.floor((event.pageY - event.target.offsetTop) / uiScale)

		const xCell = Math.floor(x / TILE_SIZE.width)
		const yCell = Math.floor(y / TILE_SIZE.height)

		setCursorPosition({
			x: xCell,
			y: yCell,
		})
	}, [setCursorPosition])

	const render = useCallback(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		context.clearRect(0, 0, canvas.width, canvas.height)

		const x = cursorPosition.x * TILE_SIZE.width
		const y = cursorPosition.y * TILE_SIZE.height

		context.fillStyle = 'red'
		context.fillRect(x, y, TILE_SIZE.width, TILE_SIZE.height)
	}, [cursorPosition])

	const resize = useCallback(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		const uiScale = Number(getComputedStyle(canvas).getPropertyValue('--ui-scale'))

		canvas.height = canvas.clientHeight
		canvas.width = canvas.clientWidth

		context.scale(uiScale, uiScale)
	}, [])

	useEffect(() => {
		resize()
		window.addEventListener('resize', resize)

		return () => window.removeEventListener('resize', resize)
	}, [resize])

	useRafael({
		dependencies: [render],
		task: render,
	})

	return (
		<motion.main
			animate={'animate'}
			className={'map-editor scene'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<menu type={'toolbar'}>
				<div className={'tiles'}>
					<header>{'Tiles'}</header>

					<button type={'button'}>
						{'floor'}
					</button>
				</div>

				<div className={'layers'}>
					<header>{'Layers'}</header>
				</div>
			</menu>

			<canvas
				ref={canvasRef}
				onMouseMove={handleMouseMove} />
		</motion.main>
	)
}
