/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { BrowserVisibility } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const visibilityOptions: ToggleOption<BrowserVisibility>[] = [
  {
    title: "Visible",
    description: "All browsers are always visible.",
    value: BrowserVisibility.VISIBLE
  },
  {
    title: "Hidden",
    description: "All browsers are hidden.",
    value: BrowserVisibility.HIDDEN
  }
];

export const SettingsMenuEffectBrowser = observer(
  function SettingsMenuEffectBrowser({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Browser</div>

          <div
            sx={{
              paddingLeft: 3,
              fontSize: 4,
              marginTop: 3,
              fontWeight: 700
            }}
          >
            Visibility
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            Control whether or not browsers are visible in the workspace.
          </div>
          <div sx={{ margin: 2 }}>
            <OptionToggle
              options2={visibilityOptions}
              current={data.activeProfile.activeMode.editorEffects.browser}
              valueKey="visibility"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
