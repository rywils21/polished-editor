/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData } from "types";

import { MenuRoute } from "./ConfigureWritingMode";
import { SetStateAction, Dispatch } from "react";
import { SettingsMenuPage } from "./SettingsMenuPage";

interface Props {
  data: AppData;
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
}

export const SettingsMenuModeName = observer(function SettingsMenuModeName({
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
          Name
        </div>
        <div sx={{ paddingLeft: 3, fontSize: 1, marginTop: 1 }}>
          The name of this mode.
        </div>
        <input
          sx={{ padding: 2, margin: 3, fontSize: 2 }}
          type="text"
          value={data.activeProfile.activeMode.name}
          onChange={evt => {
            data.activeProfile.activeMode.name = evt.target.value;
          }}
        />
      </div>
    </SettingsMenuPage>
  );
});
