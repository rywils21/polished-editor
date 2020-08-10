/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { Icons, Icon } from "components-ui/Icon";
import { ReactNode } from "react";

interface Props {
  label: ReactNode;
  value: ReactNode;
  onClick: () => void;
}

export const SettingsLink = observer(function SettingsLink({
  label,
  value,
  onClick
}: Props) {
  return (
    <div sx={{ padding: 2 }}>
      <button
        sx={{
          padding: 2,
          width: "100%",
          boxSizing: "border-box",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid hsl(0, 0%, 18%)",
          fontSize: 2,
          cursor: "pointer",
          ":hover": {
            backgroundColor: "hsl(0, 0%, 94%)"
          }
        }}
        onClick={onClick}
      >
        <div sx={{ fontWeight: 700 }}>{label}</div>
        <div sx={{ display: "flex", alignItems: "center" }}>
          <div>{value}</div>
          <div>
            <Icon icon={Icons.CHEVRON_RIGHT} />
          </div>
        </div>
      </button>
    </div>
  );
});
