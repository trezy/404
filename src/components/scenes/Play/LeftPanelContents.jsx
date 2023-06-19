// Local imports
import { FPSMeter } from '../../FPSMeter.jsx'
import { PanelMenu } from '../../Panel/PanelMenu.jsx'
import { Timer } from '../../Timer/Timer.jsx'





/**
 * Renders the contents of the left panel for the Play scene.
 */
export function LeftPanelContents() {
	return (
		<>
			<Timer
				isBordered
				isCentered
				isLarge
				isMonospace />

			<PanelMenu>
				<FPSMeter />
			</PanelMenu>
		</>
	)
}
