/** @jsx jsx */
import { Icon, Icons } from "components-ui/Icon";
import { observer } from "mobx-react-lite";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { jsx } from "theme-ui";
import { MenuRoute } from "./ConfigureWritingMode";

interface Props {
  setRoutes: Dispatch<SetStateAction<MenuRoute[]>>;
  children: ReactNode;
}

export const SettingsMenuPage = observer(function SettingsMenuPage({
  setRoutes,
  children
}: Props) {
  return (
    <div>
      <button
        sx={{
          border: "none",
          background: "none",
          marginTop: 2,
          marginLeft: 3,
          borderRadius: "50%",
          height: "48px",
          width: "48px",
          ":hover": {
            backgroundColor: "hsl(0, 0%, 93%)"
          }
        }}
        onClick={() => {
          setRoutes(r => [...r.slice(0, r.length - 1)]);
        }}
      >
        <Icon icon={Icons.ARROW_LEFT} />
      </button>
      {children}
    </div>
  );
});
