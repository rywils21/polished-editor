/** @jsx jsx */
import { jsx } from "theme-ui";
import { AppData } from "types";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { ElectronContext } from "../../../index";
import { ExpandableSection } from "components-ui/ExpandableSection";
import { toJS } from "mobx";

interface Props {
  data: AppData;
}

export const FileExplorer = observer(function FileExplorer({ data }: Props) {
  const electronControls = useContext(ElectronContext);
  return (
    <ExpandableSection barComponent="Explorer" shrinkHeight={true}>
      <div sx={{ overflow: "scroll", paddingTop: 1, paddingLeft: 2 }}>
        {data.activeWorkspace &&
          data.activeWorkspace.files.map((file) => {
            return (
              <div key={file}>
                <button
                  sx={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    paddingRight: 3,
                    paddingLeft: 3,
                    paddingTop: 1,
                    paddingBottom: 1,
                    marginTop: 1,
                    marginBottom: 1,
                    fontSize: 2,
                    width: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (electronControls) {
                      electronControls.openFile(data, file);
                    }
                  }}
                >
                  {file}
                </button>
              </div>
            );
          })}
      </div>
    </ExpandableSection>
  );
});
