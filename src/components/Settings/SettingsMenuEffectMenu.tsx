/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { MenuVisibility } from "types/editorEffects";
import { MenuRoute } from "./ConfigureWritingMode";
import { OptionToggle, ToggleOption } from "./OptionToggle";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

const visibilityOptions: ToggleOption<MenuVisibility>[] = [
  {
    title: "Visible",
    description: "The menu is always visible.",
    value: MenuVisibility.VISIBLE
  },
  {
    title: "When Hovered",
    description:
      "The menu will fade away unless it's area is hovered with a mouse.",
    value: MenuVisibility.WHEN_HOVERED
  }
];

export const SettingsMenuEffectMenu = observer(function SettingsMenuEffectMenu({
  data,
  setRoutes
}: Props) {
  return (
    <SettingsMenuPage setRoutes={setRoutes}>
      <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
        <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Menu</div>

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
          Controls how the menu is shown.
        </div>
        <div sx={{ margin: 2 }}>
          <OptionToggle
            options2={visibilityOptions}
            current={data.activeProfile.activeMode.editorEffects.menu}
            valueKey="visibility"
          />
        </div>
      </div>
    </SettingsMenuPage>
  );
});
