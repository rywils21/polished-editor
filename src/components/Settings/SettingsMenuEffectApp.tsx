/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { StartScreenEffect } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const startScreenOptions: ToggleOption<StartScreenEffect>[] = [
  {
    title: "Previous",
    description: "Uses the existing screen state.",
    value: StartScreenEffect.PREVIOUS
  },
  {
    title: "Fullscreen",
    description: "Will put the app into fullscreen.",
    value: StartScreenEffect.FULLSCREEN
  },
  {
    title: "Not fullscreen",
    description: "Will make sure the app is not fullscreen.",
    value: StartScreenEffect.NOT_FULLSCREEN
  }
];

export const SettingsMenuEffectApp = observer(function SettingsMenuEffectApp({
  data,
  setRoutes
}: Props) {
  return (
    <SettingsMenuPage setRoutes={setRoutes}>
      <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
        <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>App</div>

        <div
          sx={{
            paddingLeft: 3,
            fontSize: 4,
            marginTop: 3,
            fontWeight: 700
          }}
        >
          Starting Screen State
        </div>
        <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
          When you switch into this mode, this option controls how the editor
          window behaves in regard to being fullscreen.
        </div>
        <div sx={{ margin: 2 }}>
          <OptionToggle
            options2={startScreenOptions}
            current={data.activeProfile.activeMode.editorEffects.app}
            valueKey="startScreenState"
          />
        </div>
      </div>
    </SettingsMenuPage>
  );
});
