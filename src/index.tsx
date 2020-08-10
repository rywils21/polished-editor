import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { AppConfig, AppEnvironment, AppData } from "types";
import { ElectronControls } from "electron/clientControls";
import { createAppData } from "actions/creatorAppData";

const urlParams = new URLSearchParams(window.location.search);

export const appConfig: AppConfig = {
  showAlphaBanner: process.env.REACT_APP_ALPHA_BANNER === "true",
  marketing: urlParams.get("ref") === "marketing" ? true : false,
  startWithWriteMusic: urlParams.get("ref") === "write-music" ? true : false,
};

let appEnvironment: AppEnvironment = AppEnvironment.WEB_DEMO;

let ipcRenderer: any = null;
let electronControls: ElectronControls | null = null;
if (window.require) {
  const settings = window.require("electron-settings");
  const electron = window.require("electron");
  ipcRenderer = electron.ipcRenderer;
  electronControls = new ElectronControls(ipcRenderer, settings);

  appEnvironment = AppEnvironment.ELECTRON;

  // @ts-ignore
  window.resetApp = () => {
    ipcRenderer.invoke("reset-all-settings").then((data: any) => {
      console.log("result: ", data);
      window.location.reload();
    });
  };

  // @ts-ignore
  window.ipcRenderer = ipcRenderer;
}

export const AppContext = React.createContext<AppData>(
  createAppData(appEnvironment)
);

export const ElectronContext = React.createContext<ElectronControls | null>(
  electronControls
);

ReactDOM.render(
  <App
    appEnvironment={appEnvironment}
    electronControls={electronControls}
    ipcRenderer={ipcRenderer}
  />,
  document.getElementById("root")
);
