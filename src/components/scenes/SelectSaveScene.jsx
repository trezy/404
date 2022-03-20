import { useCallback } from "react";
import { useStore } from "../../store/react";
import { Scene } from "../Scene";
import React from "react";
import { Button } from "../Button";
import { PanelsLayout } from "../layouts/PanelsLayout";
import { Panel } from "../Panel";
import { ButtonStack } from "../ButtonStack";
import saveManager from "../../game/SaveManager";
import { convertMillisecondsToStopwatchString } from "../../helpers/convertMillisecondsToStopwatchString";

export function SelectSaveScene() {
  const [loadSave, goToSettings, goToTitle] = useStore((state) => [
    state.doStuffSave,
    state.goToSettings,
    state.goToTitle,
  ]);
  const mappedMaps = saveManager.getAllSaves().map((save, index) => {
    const d = new Date(save._lastUpdateTime);
    return (
      <tr key={index}>
        <th>{save.name}</th>
        <td>{convertMillisecondsToStopwatchString(save.levelData.levels.reduce((total,level)=>total+Math.max(0,level.time),0))}</td>
		<td>{' | '}</td>
        <td>{new Intl.DateTimeFormat([],{
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric'
}).format(d)}</td>
        <td>
          <Button isSmall onClick={() => {
			loadSave(save.id)
		  }}>
            {"Load"}
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Scene id="map-select">
      <PanelsLayout id="title">
        <Panel>
          <h2>{"Menu"}</h2>

          <ButtonStack className="panel-bottom">
            <Button>{"Statistics"}</Button>

            <Button onClick={goToSettings}>{"Settings"}</Button>

            <Button onClick={goToTitle}>{"Main Menu"}</Button>
          </ButtonStack>
        </Panel>

        <Panel columnSpan={3}>
          <h2>{"Load Save"}</h2>

          <table>
            <tbody>{mappedMaps}</tbody>
          </table>
        </Panel>
      </PanelsLayout>
    </Scene>
  );
}
