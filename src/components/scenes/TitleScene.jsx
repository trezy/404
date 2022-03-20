// Local imports
import { Button } from "../Button.jsx";
import { ButtonStack } from "../ButtonStack.jsx";
import { GameTitle } from "../GameTitle.jsx";
import { Panel } from "../Panel.jsx";
import { PanelsLayout } from "../layouts/PanelsLayout.jsx";
import { Scene } from "../Scene.jsx";
import { useStore } from "../../store/react.js";

export function TitleScene() {
  const [goToSettings, goToSelectSave] = useStore((state) => [
    state.goToSettings,
    state.goToSelectSave,
  ]);

  return (
    <Scene id="title">
      <PanelsLayout id="title">
        <Panel>
          <h2>{"Menu"}</h2>

          <ButtonStack className="panel-bottom">
            <Button isPrimary>{"Continue"}</Button>

            <Button>{"New Game"}</Button>

            <Button onClick={goToSelectSave}>{"Load Game"}</Button>

            <Button onClick={goToSettings}>{"Settings"}</Button>
          </ButtonStack>
        </Panel>

        <Panel columnSpan={3} isCentered>
          <GameTitle />
        </Panel>
      </PanelsLayout>
    </Scene>
  );
}
