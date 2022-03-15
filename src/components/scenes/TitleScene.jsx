// Local imports
import { Button } from '../Button.jsx'
import { ButtonStack } from '../ButtonStack.jsx'
import { GameTitle } from '../GameTitle.jsx'
import { Panel } from '../Panel.jsx'
import { PanelsLayout } from '../layouts/PanelsLayout.jsx'





export function TitleScene() {
	return (
		<PanelsLayout id="title">
			<Panel>
				<h2>{'Menu'}</h2>

				<ButtonStack className="panel-bottom">
					<Button isPrimary>
						{'Continue'}
					</Button>

					<Button>
						{'New Game'}
					</Button>

					<Button>
						{'Load Game'}
					</Button>

					<Button>
						{'Settings'}
					</Button>
				</ButtonStack>
			</Panel>

			<Panel
				columnSpan={3}
				isCentered>
				<GameTitle />
			</Panel>
		</PanelsLayout>
	)
}
