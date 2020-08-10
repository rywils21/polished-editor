import { markdownProcessor, getStartingXY } from "./../hooks/useData";
import { createDocumentRoot } from "../actions/creatorAppElements";
import { AppDataStatus, ProfileData } from "types";
import { AppData, UserData } from "types/index";
import { IpcRenderer } from "electron";
import { DocumentRoot } from "types/appTypes";
import { loadProfileData } from "actions/creatorAppData";
import { focusDocument } from "../misc/utls";

export class ElectronControls {
  ipcRenderer: IpcRenderer;
  settings: any;

  constructor(ipcRenderer: IpcRenderer, settings: any) {
    this.ipcRenderer = ipcRenderer;
    this.settings = settings;
  }

  async closeWindow() {
    this.ipcRenderer.send("windows-title-bar-quit");
  }

  async maximizeWindow() {
    this.ipcRenderer.send("windows-title-bar-maximize");
  }

  async minimizeWindow() {
    this.ipcRenderer.send("windows-title-bar-minimize");
  }

  async loadSettings(data: AppData) {
    data.status = AppDataStatus.LOADING_SETTINGS;
    const settings = await this.ipcRenderer.invoke("load-settings");

    console.log("loaded settings: ", settings);

    if (settings && settings.profiles) {
      if (settings.selectedProfile) {
        data.selectedProfile = settings.selectedProfile;
      }

      let profiles: { [s: string]: ProfileData } = {};

      Object.keys(settings.profiles).forEach((profileKey: string) => {
        const profile: Partial<ProfileData> = settings.profiles[profileKey];
        profiles[profileKey] = loadProfileData(profile);
      });

      data.profiles = profiles;

      // TODO: Load and reconcile with defaults
    }
    // TODO: handle edge case where there isn't a selected profile and mode

    data.status = AppDataStatus.LOADING_DATA;
    if (settings && settings.workspaces) {
      console.log("got workspaces: ", settings.workspaces);

      const workspaceNames = Object.keys(settings.workspaces);

      for (let i = 0; i < workspaceNames.length; i++) {
        const name = workspaceNames[i];
        const workspace = settings.workspaces[name];

        workspace.documents = workspace.documents.map((doc: any) => {
          const ast = markdownProcessor.parse(doc.content);
          // @ts-ignore
          return createDocumentRoot(ast, doc.position, doc.path);
        });

        workspace.selection = [];

        if (!workspace.files) {
          workspace.files = [];
        }
      }

      data.workspaces = settings.workspaces;
    }
    if (settings && settings.selectedWorkspace) {
      data.selectedWorkspace = settings.selectedWorkspace;
    }
    // TODO: handle edge case where there isn't a selected workspace

    data.status = AppDataStatus.INTERACTIVE;
  }

  async saveWorkspace(workspaceName: string, workspace: any) {
    console.log("saving workspace");
    this.ipcRenderer.send("save-workspace", workspaceName, workspace);
  }

  async saveModeSettings(profileName: string, profile: ProfileData) {
    console.log("saving mode settings");
    this.ipcRenderer.send("save-mode-settings", profileName, profile);
  }

  async saveUserData(userData: UserData) {
    this.ipcRenderer.send("save-user-data", userData);
  }

  openNewWorkspace() {
    this.ipcRenderer.send("request-open-workspace");
  }

  async openFile(data: AppData, filename: string) {
    const rootDir = data.activeWorkspace?.rootDir;

    if (rootDir) {
      const fileContent = await this.ipcRenderer.invoke(
        "request-open-file",
        `${rootDir}/${filename}`
      );

      const document = createDocumentRoot(
        // @ts-ignore
        markdownProcessor.parse(fileContent),
        getStartingXY(data.activeWorkspace),
        `${rootDir}/${filename}`
      );

      console.log("created new document: ", document);

      if (data.activeWorkspace) {
        data.activeWorkspace.documents.push(document);

        focusDocument(data, data.activeWorkspace.documents.length - 1);
      }
    }
  }

  saveDocument(doc: DocumentRoot) {
    // @ts-ignore
    const content = markdownProcessor.stringify(doc);
    return this.ipcRenderer
      .invoke("save-file", {
        path: doc.path,
        content,
      })
      .then((result) => {
        doc.unsavedChanges = false;
      })
      .catch((err) => {
        console.log("error saving file: ", err);
      });
  }

  saveDocumentAs(doc: DocumentRoot) {
    // @ts-ignore
    const content = markdownProcessor.stringify(doc);
    return this.ipcRenderer
      .invoke("save-file-as", {
        content,
      })
      .then((newFilePath) => {
        // should have new path in the result here
        if (newFilePath) {
          doc.path = newFilePath;
          doc.unsavedChanges = false;
        }
      })
      .catch((err) => {
        console.log("error saving file: ", err);
      });
  }

  async saveDocuments(appData: AppData) {
    if (appData.activeWorkspace) {
      for (let i = 0; i < appData.activeWorkspace.documents.length; i++) {
        const doc = appData.activeWorkspace.documents[i];
        if (!doc.path) {
          await this.saveDocumentAs(doc);
        } else if (doc.unsavedChanges) {
          await this.saveDocument(doc);
        }
      }
    }
  }
}
