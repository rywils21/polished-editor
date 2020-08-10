/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData, BrowserObject } from "types";
import { RightSidebar } from "../components-ui/Sidebar";
import { ElectronControls } from "electron/clientControls";
import { DocumentRoot } from "types/appTypes";
import { Icon, Icons } from "components-ui/Icon";

interface Props {
  data: AppData;
  electronControls: ElectronControls | null;
}
export const WorkspaceExplorer = observer(function WorkspaceExplorer({
  data,
  electronControls
}: Props) {
  // function close() {
  //   data.workspaceExplorerOpen = false;
  // }
  return (
    <RightSidebar shown={true} close={() => {}}>
      <div sx={{ padding: 4 }}>
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <h2>{data.activeWorkspace?.name || "No workspace"}</h2>
          <div>
            {data.activeWorkspace && (
              <button
                sx={{ background: "none", border: "none" }}
                onClick={() => {
                  delete data.workspaces[data.selectedWorkspace];
                  const workspaceNames = Object.keys(data.workspaces);
                  if (workspaceNames.length > 0) {
                    data.selectedWorkspace = workspaceNames[0];
                  } else {
                    data.selectedWorkspace = "";
                  }
                }}
              >
                <Icon icon={Icons.TRASH} />
              </button>
            )}
          </div>
        </div>
        <h3>Documents</h3>
        {data.activeWorkspace &&
          data.activeWorkspace.documents.map((doc: DocumentRoot) => {
            return (
              <div key={doc.path}>
                <button
                  onClick={() => {
                    // TODO: zoom to this file
                  }}
                >
                  {doc.path}
                </button>
              </div>
            );
          })}
        <h3>Explorer</h3>
        {data.activeWorkspace &&
          data.activeWorkspace.files.map(file => {
            return (
              <div key={file}>
                <button
                  onClick={() => {
                    electronControls?.openFile(data, file);
                  }}
                >
                  {file}
                </button>
              </div>
            );
          })}
        <h3>Browsers</h3>
        {data.activeWorkspace &&
          data.activeWorkspace.browsers.map(
            (browser: BrowserObject, i: number) => {
              return (
                <div key={`${browser.src}${i}`}>
                  <button
                    onClick={() => {
                      // TODO: zoom to this browser
                    }}
                  >
                    {browser.src}
                  </button>
                </div>
              );
            }
          )}
      </div>
    </RightSidebar>
  );
});
