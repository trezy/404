// Module imports
import { useEffect } from 'react'





// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { FPSMeter } from '../FPSMeter.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'
import { Scene } from '../Scene.jsx'
import { Timer } from '../Timer.jsx'
import { useStore } from '../../store/react.js'





export function PlayScene() {
	const [
		goToMapSelect,
		startGameLoop,
		stopGameLoop,
	] = useStore(state => [
		state.goToMapSelect,
		state.startGameLoop,
		state.stopGameLoop,
	])

	useEffect(() => {
		startGameLoop()
		return stopGameLoop
	}, [startGameLoop])

	return (
		<Scene id="play">
			<PanelsLayout id="title">
				<Panel>
					<h2>{'Menu'}</h2>

					<ButtonStack className="panel-bottom">
						<Button onClick={goToMapSelect}>
							{'Quit'}
						</Button>
					</ButtonStack>
				</Panel>

				<Panel
					columnSpan={2}
          isPrimary>
					<canvas id="game-canvas" />
				</Panel>

				<Panel columnSpan={1}>
					<Timer
						isBordered
						isCentered
						isLarge
						isMonospace />

					<div className="panel-bottom">
						<FPSMeter />
					</div>
				</Panel>
			</PanelsLayout>
		</Scene>
	)
}
