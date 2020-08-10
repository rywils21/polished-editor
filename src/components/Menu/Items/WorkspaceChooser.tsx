/** @jsx jsx */
import { jsx } from "theme-ui";
import { AppData } from "types";
import { observer } from "mobx-react-lite";
import { useContext, MouseEvent } from "react";
import { ElectronContext } from "../../../index";
import { ExpandableSection } from "components-ui/ExpandableSection";
import { Icon, Icons } from "components-ui/Icon";

interface Props {
  data: AppData;
}

export const WorkspaceChooser = observer(function WorkspaceChooser({
  data,
}: Props) {
  const electronControls = useContext(ElectronContext);

  const barComponent = (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>Workspaces</div>
      <button
        sx={{ background: "none", border: "none" }}
        onClick={(evt: MouseEvent) => {
          if (electronControls) {
            evt.stopPropagation();
            electronControls.openNewWorkspace();
          }
        }}
      >
        <Icon icon={Icons.FOLDER_PLUS} width={16} height={16} />
      </button>
    </div>
  );
  return (
    <ExpandableSection barComponent={barComponent}>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
        }}
      >
        {Object.keys(data.workspaces).map(
          (workspaceName: string, i: number) => (
            <button
              key={workspaceName}
              sx={{
                fontSize: 2,
                padding: 2,
                paddingLeft: 4,
                border: "none",
                borderLeft:
                  data.selectedWorkspace === workspaceName
                    ? "3px solid transparent"
                    : "3px solid transparent",
                backgroundColor:
                  data.selectedWorkspace === workspaceName
                    ? "white"
                    : "transparent",
                fontWeight:
                  data.selectedWorkspace === workspaceName ? 700 : 400,
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => {
                data.selectedWorkspace = workspaceName;
              }}
            >
              {workspaceName}
            </button>
          )
        )}
      </div>
    </ExpandableSection>
  );
});
