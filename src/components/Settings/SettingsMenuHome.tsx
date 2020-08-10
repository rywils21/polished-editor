/** @jsx jsx */
import { MenuIcon } from "components-ui/MenuIcon";
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { MenuRoute } from "./ConfigureWritingMode";
import { SettingsLink } from "./SettingsLink";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuHome = observer(function SettingsMenuHome({
  data,
  setRoutes
}: Props) {
  return (
    <div>
      <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Info</div>
      <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
        Customize the mode name and icon.
      </div>
      <SettingsLink
        label="Name"
        value={data.activeProfile.activeMode.name}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_NAME]);
        }}
      />
      <SettingsLink
        label="Icon"
        value={<MenuIcon icon={data.activeProfile.activeMode.icon} />}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_ICON]);
        }}
      />
      <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 5 }}>Menu</div>
      <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
        Configure how the menu bar appears for this mode.
      </div>
      <SettingsLink
        label="Initial State"
        value={data.activeProfile.activeMode.menu.defaultState}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_MENU_INITIAL_STATE]);
        }}
      />
      <SettingsLink
        label="Menu Items"
        value={`${data.activeProfile.activeMode.menu.items.length} items`}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_MENU_ITEMS]);
        }}
      />
      <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 5 }}>
        Editor Effects
      </div>
      <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
        Control how the editor behaves. Toggle whether the menu fades, configure
        key presses, and much more.
      </div>
      <SettingsLink
        label="Controls"
        value={``}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_CONTROL]);
        }}
      />
      <SettingsLink
        label="Document"
        value={``}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_DOCUMENT]);
        }}
      />
      <SettingsLink
        label="Browser"
        value={``}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_BROWSER]);
        }}
      />
      <SettingsLink
        label="Canvas"
        value={``}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_CANVAS]);
        }}
      />
      <SettingsLink
        label="Menu"
        value={""}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_MENU]);
        }}
      />
      <SettingsLink
        label="App"
        value={``}
        onClick={() => {
          setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_APP]);
        }}
      />
    </div>
  );
});
