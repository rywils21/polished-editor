/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData } from "types";

import { MenuRoute } from "./ConfigureWritingMode";
import { SetStateAction, Dispatch } from "react";
import { SettingsMenuPage } from "./SettingsMenuPage";
import { MenuIcons } from "components-ui/MenuIcon";
import { MenuIconChooser } from "components-ui/MenuIconChooser";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuModeIcon = observer(function SettingsMenuModeIcon({
  data,
  setRoutes
}: Props) {
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
          Icon
        </div>
        <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
          The icon that appears in the menu bar for this mode.
        </div>
        <MenuIconChooser
          currentIcon={data.activeProfile.activeMode.icon}
          select={(icon: MenuIcons) => {
            data.activeProfile.activeMode.icon = icon;
          }}
        />
      </div>
    </SettingsMenuPage>
  );
});
