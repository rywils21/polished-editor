/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { MenuRoute } from "./ConfigureWritingMode";
import { MenuItems } from "./MenuItems";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuModeMenuItems = observer(
  function SettingsMenuModeMenuItems({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <MenuItems data={data} />
      </SettingsMenuPage>
    );
  }
);
