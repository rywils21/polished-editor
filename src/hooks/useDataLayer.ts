import { IpcRenderer, IpcRendererEvent } from "electron";
import { focusDocument } from "misc/utls";
import { reaction, toJS } from "mobx";
import { useEffect } from "react";
import { AppData, ElectronMarkdownFile } from "types/index";
import { ElectronControls } from "../electron/clientControls";
import {
  loadMarkdownFile,
  loadNewMarkdownFile,
  markdownProcessor,
  loadDemoData,
} from "./useData";
import { DocumentRoot } from "types/appTypes";
import { AppEnvironment, AppDataStatus } from "../types/index";

interface OpenFolderResult {
  rootDir: string;
  files: string[];
}

export function useDataLayer(
  appEnvironment: AppEnvironment,
  data: AppData,
  electronControls: ElectronControls | null,
  ipcRenderer: IpcRenderer | null
) {
  useEffect(() => {
    if (appEnvironment === AppEnvironment.ELECTRON) {
      if (electronControls && ipcRenderer) {
        electronControls.loadSettings(data);

        configureWorkspaceReactions(data, electronControls);

        configureElectronHotKeys(data, electronControls, ipcRenderer);

        configureElectronEvents(data, electronControls, ipcRenderer);
      }
    } else {
      // It's the web environment - load the demo data
      loadDemoData(data);
      data.status = AppDataStatus.INTERACTIVE;
    }
  }, [data, electronControls, appEnvironment, ipcRenderer]);
}

function configureElectronEvents(
  data: AppData,
  electronControls: ElectronControls,
  ipcRenderer: IpcRenderer
) {
  ipcRenderer.on(
    "workspace-opened",
    (event: IpcRendererEvent, { rootDir, files }: OpenFolderResult) => {
      let sliceIndex = rootDir.lastIndexOf("/");
      if (sliceIndex === -1) {
        sliceIndex = rootDir.lastIndexOf("\\");
      }
      const workspaceName = rootDir.slice(sliceIndex + 1);

      if (data.workspaces[workspaceName]) {
        // If already existed, just update the file list
        data.workspaces[workspaceName] = {
          ...data.workspaces[workspaceName],
          files,
        };
      } else {
        // If new, initialize workspace object
        data.workspaces[workspaceName] = {
          name: workspaceName,
          rootDir,
          files,
          documents: [],
          browsers: [],
          selection: [],
          view: { x: 0, y: 0, zoom: 1 },
        };
      }
      data.selectedWorkspace = workspaceName;
    }
  );

  ipcRenderer.on(
    "new-file",
    (event: IpcRendererEvent, fileData: ElectronMarkdownFile) => {
      if (data.activeWorkspace) {
        const doc = loadMarkdownFile(fileData, data);
        data.activeWorkspace.documents.push(doc);

        focusDocument(data, data.activeWorkspace.documents.length - 1);
      }
    }
  );
}

function configureElectronHotKeys(
  data: AppData,
  electronControls: ElectronControls,
  ipcRenderer: IpcRenderer
) {
  // cmd + s hit from electron
  ipcRenderer.on("request-renderer-save-files", (event: IpcRendererEvent) => {
    if (electronControls) {
      electronControls.saveDocuments(data);
    }
  });

  // cmd + n hit on backend
  ipcRenderer.on(
    "request-renderer-create-new-file",
    (event: IpcRendererEvent) => {
      loadNewMarkdownFile(data);
    }
  );

  // debug messaging from backend
  ipcRenderer.on("message", (event: IpcRendererEvent, data: any) => {
    console.log("backend message: ", data);
  });
}

// mobx reactions to call electron to save the new state when things change
function configureWorkspaceReactions(
  data: AppData,
  electronControls: ElectronControls | null
) {
  reaction(
    () => {
      // TODO: how to save the view only when it stops changing
      if (data.activeWorkspace) {
        let result: any[] = [data.activeWorkspace.rootDir];
        result = [
          ...result,
          ...data.activeWorkspace.documents.map(
            (d) => `${d.path}-${JSON.stringify(d.position)}`
          ),
          ...data.activeWorkspace.browsers.map((b) => JSON.stringify(b)),
        ];
        return result;
      } else {
        return null;
      }
    },
    () => {
      if (electronControls && data.activeWorkspace) {
        const ws = toJS(data.activeWorkspace);

        // TODO: create a DTO type for what data to send to electron here
        const workspaceToSave = {
          rootDir: ws.rootDir,
          view: { ...ws.view },
          browsers: [...ws.browsers],
          documents: [
            ...ws.documents.map((doc: DocumentRoot) => {
              return {
                position: doc.position,
                path: doc.path,
                // @ts-ignore
                content: markdownProcessor.stringify(doc),
              };
            }),
          ],
        };

        electronControls.saveWorkspace(data.selectedWorkspace, workspaceToSave);
      }
    }
  );

  reaction(
    () => {
      if (data.activeProfile) {
        let result: any[] = [data.activeProfile.selectedMode];
        result = [
          ...result,
          ...data.activeProfile.modes.map((m) => JSON.stringify(m)),
        ];
        return result;
      } else {
        return null;
      }
    },
    () => {
      if (electronControls && data.activeProfile) {
        electronControls.saveModeSettings(
          data.selectedProfile,
          toJS(data.activeProfile)
        );
      }
    }
  );
}
