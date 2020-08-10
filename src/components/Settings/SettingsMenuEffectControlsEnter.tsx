/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { EnterKeyEffect } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const options: ToggleOption<EnterKeyEffect>[] = [
  {
    title: "New Paragraph",
    description: "Creates a new paragraph at the location of the cursor.",
    value: EnterKeyEffect.NEW_PARAGRAPH
  },
  {
    title: "New Page",
    description: "Creates a new document on the canvas.",
    value: EnterKeyEffect.NEW_PAGE
  },
  {
    title: "Disabled",
    description: "Does nothing.",
    value: EnterKeyEffect.NOTHING
  }
];

export const SettingsMenuEffectControlsEnter = observer(
  function SettingsMenuEffectControlsEnter({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            Enter Key
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Activated by hitting the Enter (Return) key.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={options}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="Enter"
            />
          </div>
          <div
            sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3, fontWeight: 700 }}
          >
            Shift + Enter Key
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Activated by hitting Shift + the Enter (Return) key.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={options}
              current={data.activeProfile.activeMode.editorEffects.controls}
              valueKey="ShiftEnter"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
