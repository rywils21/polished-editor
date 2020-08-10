/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData, ModeMenuState } from "types";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const initialStateOptions: ToggleOption<ModeMenuState>[] = [
  {
    title: "Open",
    description: "The workspace menu will be open upon entering this mode.",
    value: ModeMenuState.OPEN
  },
  {
    title: "Closed",
    description: "The workspace menu will be closed upon entering this mode.",
    value: ModeMenuState.CLOSED
  }
];

export const SettingsMenuModeMenuInitialState = observer(
  function SettingsMenuModeMenuInitialState({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div
            sx={{
              paddingLeft: 3,
              fontSize: 4,
              marginTop: 3,
              fontWeight: 700
            }}
          >
            Initial State
          </div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            The initial state of the workspace menu when you enter this mode. If
            the menu is closed, you can open it by clicking the mode icon
            without toggling this setting.
          </div>

          <div sx={{ padding: 2 }}>
            <OptionToggle
              options2={initialStateOptions}
              current={data.activeProfile.activeMode.menu}
              valueKey="defaultState"
            />
          </div>
        </div>
      </SettingsMenuPage>
    );
  }
);
