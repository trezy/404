// Local imports
import { CenterPanel } from '../../CenterPanel.jsx'
import { LeftPanel } from '../../LeftPanel.jsx'
import { Scene } from '../../Scene/Scene.jsx'





// Constants
const VARIANTS = {
	animate: {
		opacity: 1,
		transition: {
			duration: 0,
		},
	},

	exit: {
		opacity: 0,
	},

	initial: {
		opacity: 0,
	},
}





export function MainScene() {
	return (
		<Scene
			key={'main'}
			animate={'animate'}
			exit={'exit'}
			initial={'initial'}
			variants={VARIANTS}>
			<div className={'layout panels'}>
				<LeftPanel />
				<CenterPanel />
			</div>
		</Scene>
	)
}
