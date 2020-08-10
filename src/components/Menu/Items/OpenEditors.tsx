/** @jsx jsx */
import { jsx } from "theme-ui";
import { AppData, BrowserObject } from "types";
import { observer } from "mobx-react-lite";
import { DocumentRoot } from "types/appTypes";
import { focusDocument, focusBrowser } from "misc/utls";
import { ExpandableSection } from "components-ui/ExpandableSection";
import { Icon, Icons } from "components-ui/Icon";
import { loadNewMarkdownFile, loadNewWebBrowser } from "hooks/useData";
import { MouseEvent } from "react";

interface Props {
  data: AppData;
}

export const OpenEditors = observer(function OpenEditors({ data }: Props) {
  const barComponent = (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      <div sx={{ paddingBottom: 1 }}>Open Editors</div>
      <div
        sx={{
          display: "flex",
          button: { border: "none", background: "none", padding: 1 }
        }}
      >
        <button
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation();
            loadNewMarkdownFile(data);
          }}
        >
          <Icon icon={Icons.FILE_PLUS} width={16} height={16} />
        </button>
        <button
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation();
            loadNewWebBrowser(data);
          }}
        >
          <Icon icon={Icons.BROWSER_PLUS} width={16} height={16} />
        </button>
      </div>
    </div>
  );
  return (
    <ExpandableSection barComponent={barComponent}>
      <div sx={{ padding: 2 }}>
        {data.activeWorkspace &&
          data.activeWorkspace.documents.map((doc: DocumentRoot, i: number) => {
            // TODO: come up with a keying strategy for untitled documents
            return (
              <div key={doc.path || "untitled"}>
                <button
                  sx={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    paddingRight: 2,
                    paddingLeft: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    marginTop: 1,
                    marginBottom: 1,
                    fontSize: 2,
                    width: "auto",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  onClick={() => {
                    focusDocument(data, i);
                  }}
                >
                  <Icon icon={Icons.PAPER} />
                  <div sx={{ paddingLeft: 2 }}>{doc.name}</div>
                </button>
              </div>
            );
          })}
        {data.activeWorkspace &&
          data.activeWorkspace.browsers.map(
            (browser: BrowserObject, i: number) => {
              return (
                <div key={`${browser.src}${i}`}>
                  <button
                    sx={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      paddingRight: 2,
                      paddingLeft: 2,
                      paddingTop: 1,
                      paddingBottom: 1,
                      marginTop: 1,
                      marginBottom: 1,
                      fontSize: 2,
                      width: "auto",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                    onClick={() => {
                      focusBrowser(data, i);
                    }}
                  >
                    <Icon icon={Icons.BROWSER} />
                    <div sx={{ paddingLeft: 2 }}>{browser.src}</div>
                  </button>
                </div>
              );
            }
          )}
      </div>
    </ExpandableSection>
  );
});
