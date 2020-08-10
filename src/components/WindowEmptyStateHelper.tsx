/** @jsx jsx */
import { jsx } from "theme-ui";
import { AppData } from "types";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { ElectronContext } from "../index";

interface Props {
  data: AppData;
}

export const WindowEmptyStateHelper = observer(function WindowEmptyStateHelper({
  data,
}: Props) {
  const electronControls = useContext(ElectronContext);

  return electronControls && data.activeWorkspace === null ? (
    <div
      sx={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        borderRadius: 3,
        background: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        button: {
          fontSize: 2,
          fontWeight: 500,
          textDecoration: "underline",
          cursor: "pointer",
          border: "none",
          background: "none",
        },
      }}
    >
      <button onClick={() => electronControls.openNewWorkspace()}>
        {" "}
        Open a folder
      </button>{" "}
      to get started.
    </div>
  ) : null;
});
