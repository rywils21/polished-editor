/** @jsx jsx */
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { AppData } from "types";
import { MenuRoute } from "./ConfigureWritingMode";
import { SettingsLink } from "./SettingsLink";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuEffectControls = observer(
  function SettingsMenuEffectControls({ data, setRoutes }: Props) {
    return (
      <SettingsMenuPage setRoutes={setRoutes}>
        <div sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
          <div sx={{ paddingLeft: 3, fontSize: 4, marginTop: 3 }}>Controls</div>
          <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
            These settings control how different user controls interact with the
            editor. Control what happens when you hit the enter key, scroll on
            the canvas, and more.
          </div>
          <SettingsLink
            label="Enter Key"
            value={""}
            onClick={() => {
              setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_CONTROL_ENTER]);
            }}
          />
          <SettingsLink
            label="Scroll Wheel"
            value={""}
            onClick={() => {
              setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_CONTROL_SCROLL]);
            }}
          />
          <SettingsLink
            label="Click and Drag"
            value={""}
            onClick={() => {
              setRoutes(r => [...r, MenuRoute.MODE_EFFECTS_CONTROL_DRAG]);
            }}
          />
        </div>
      </SettingsMenuPage>
    );
  }
);
