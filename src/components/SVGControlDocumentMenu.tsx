/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { DocumentRoot } from "types/appTypes";
import { ElectronContext, AppContext } from "../index";
import { Icon, Icons } from "components-ui/Icon";
import { DOCUMENT_CONTROLS_HEIGHT } from "misc/constants";

interface PropTypes {
  document: DocumentRoot;
  documentIndex: number;
}

export const SVGControlDocumentMenu = observer(function SVGDocument({
  document,
  documentIndex,
}: PropTypes) {
  const electronControls = useContext(ElectronContext);
  const appData = useContext(AppContext);

  let saveButtonDisplay = <div></div>;

  if (
    electronControls &&
    (document.path === undefined || document.unsavedChanges)
  ) {
    saveButtonDisplay = (
      <button
        sx={{
          borderRadius: "4px",
          ":hover": {
            backgroundColor: "hsla(237, 100%, 50%, 0.15)",
          },
        }}
        onMouseDown={() => {
          if (document.path) {
            electronControls.saveDocument(document);
          } else {
            electronControls.saveDocumentAs(document);
          }
        }}
      >
        <div
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon icon={Icons.SAVE} />
          <span sx={{ padding: 1 }}>Unsaved Changes</span>
        </div>
      </button>
    );
  }

  return (
    <g transform={`translate(0 0)`}>
      <foreignObject
        width={document.width + document.padding.left + document.padding.right}
        height={DOCUMENT_CONTROLS_HEIGHT}
      >
        <div
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            button: {
              border: "none",
              background: "none",
              margin: 1,
            },
          }}
        >
          <button
            sx={{
              borderRadius: "4px",
              ":hover": {
                backgroundColor: "hsla(237, 100%, 50%, 0.15)",
              },
            }}
            onMouseDown={() => {
              document.dragging = true;
              appData.draggingAnything = true;
            }}
          >
            <Icon icon={Icons.MOVE} />
          </button>
          <div
            sx={{
              flex: "1 1 100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {electronControls ? document.name : ""}
          </div>

          {electronControls && saveButtonDisplay}
          <div>
            <button
              sx={{
                borderRadius: "28px",
                ":hover": {
                  backgroundColor: "hsla(360, 100%, 50%, 0.5)",
                },
              }}
              onClick={() => {
                if (appData.activeWorkspace) {
                  appData.activeWorkspace.documents.splice(documentIndex, 1);
                }
              }}
            >
              <Icon icon={Icons.CROSS} />
            </button>
          </div>
        </div>
      </foreignObject>
    </g>
  );
});
