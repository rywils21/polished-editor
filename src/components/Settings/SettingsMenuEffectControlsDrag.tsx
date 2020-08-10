/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { ClickDragEffect } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const options: ToggleOption<ClickDragEffect>[] = [
  {
    title: "Pan Canvas",
    description: "Pans the canvas based on the distance dragged.",
    value: ClickDragEffect.PAN_CANVAS
  },
  {
    title: "Disabled",
    description: "Does nothing.",
    value: ClickDragEffect.DISABLED
  }
];

export const SettingsMenuEffectControlsDrag = observer(
  function SettingsMenuEffectControlsDrag({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            Click + Drag
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            What happens when you click and drag on the canvas.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={options}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="ClickDrag"
            />
          </div>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            CmdOrCtrl + Click + Drag
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            What happens when you click and drag on the canvas while holding
            CmdOrCtrl.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={options}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="CmdOrCtrlClickDrag"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
