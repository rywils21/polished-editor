import {
  EditorEffects,
  MenuVisibility,
  EnterKeyEffect,
  BrowserVisibility,
  DocumentVisibility,
  DocumentEffectVisibility,
  DocumentHeight,
  FadeTextValue,
  CursorVisibility,
  Autoscroll,
  StartScreenEffect,
  WheelEffect,
  ClickDragEffect,
  PinchEffect,
  DocumentAutoSave,
  GrammarEffectStatus,
} from "./../types/editorEffects";
import Bowser from "bowser";
import { loadNewMarkdownFile, markdownProcessor } from "hooks/useData";
import { KeyboardEvent } from "react";

import {
  AppData,
  ProfileData,
  ModeMenuState,
  Mode,
  MenuItemKey,
  AppDataStatus,
} from "types";
import {
  AppEnvironment,
  AppNetworkStatus,
  AuthState,
  BrowserObject,
  DocumentPosition,
  UserTier,
} from "types";
import { DocumentRoot } from "types/appTypes";
import { MenuIcons } from "components-ui/MenuIcon";
import deepmerge from "deepmerge";
import { Trial } from "../types/index";
import { remarkToHtmlProcessor, htmlProcessor } from "../hooks/useData";
import { loadDocumentFromMarkdown } from "./creatorAppElements";

const browser = Bowser.getParser(window.navigator.userAgent);

export function isControlModifierActive(
  evt: MouseEvent | KeyboardEvent
): boolean {
  if (browser.getOSName() === "macOS") {
    return evt.metaKey;
  } else {
    return evt.ctrlKey;
  }
}

function getNewBrowserXY(browsers: BrowserObject[]): DocumentPosition {
  let rightMostBrowser = 500;
  let y = 100;
  browsers.forEach((browser: BrowserObject) => {
    if (browser.position.x < rightMostBrowser) {
      rightMostBrowser = browser.position.x;
      y = browser.position.y;
    }
  });

  const x = rightMostBrowser - window.innerWidth / 2 - 1200 / 2 - 100;

  return { x, y };
}

export function createNewBrowser(data: AppData, url?: string): BrowserObject {
  return {
    // @ts-ignore
    position: getNewBrowserXY(data.activeWorkspace.browsers),
    dragging: false,
    resizing: [],
    width: 1000,
    height: 800,
    src: url || "https://www.google.com/webhp?igu=1",
  };
}

export function getDefaultMode(): Mode {
  return {
    name: "Home",
    icon: MenuIcons.COPYWRITING,
    theme: "default",
    menu: {
      defaultState: ModeMenuState.OPEN,
      items: [
        { key: MenuItemKey.WORKSPACE_CHOOSER },
        { key: MenuItemKey.OPEN_EDITORS },
        { key: MenuItemKey.FILE_EXPLORER },
        { key: MenuItemKey.VIEW_CONTROLS },
      ],
    },
    editorEffects: getDefaultHomeEffects(),
  };
}

export function getDefaultHomeEffects(): EditorEffects {
  return {
    menu: {
      visibility: MenuVisibility.VISIBLE,
    },
    controls: {
      Enter: EnterKeyEffect.NEW_PARAGRAPH,
      ShiftEnter: EnterKeyEffect.NEW_PAGE,
      Wheel: WheelEffect.SCROLL_DOCUMENT,
      CmdOrCtrlWheel: PinchEffect.ZOOM,
      ClickDrag: ClickDragEffect.PAN_CANVAS,
      CmdOrCtrlClickDrag: ClickDragEffect.DISABLED,
    },
    browser: {
      visibility: BrowserVisibility.VISIBLE,
    },
    document: {
      visibility: DocumentVisibility.VISIBLE,
      height: {
        value: DocumentHeight.FIT_CONTENT,
        options: {
          defaultContainerHeight: 1200,
        },
      },
      defaultWidth: 980,
      text: {
        fade: {
          value: FadeTextValue.NEVER,
        },
      },
      menu: {
        visibility: DocumentEffectVisibility.VISIBLE,
      },
      autoSave: DocumentAutoSave.DISABLED,
      grammar: {
        status: GrammarEffectStatus.DISABLED,
      },
    },
    canvas: {
      autoscroll: {
        value: Autoscroll.NONE,
      },
      cursor: {
        visibility: CursorVisibility.VISIBLE,
      },
    },
    app: {
      startScreenState: StartScreenEffect.NOT_FULLSCREEN,
    },
  };
}

export function getDefaultFocusEffects(): EditorEffects {
  return {
    menu: {
      visibility: MenuVisibility.WHEN_HOVERED,
    },
    controls: {
      Enter: EnterKeyEffect.NEW_PARAGRAPH,
      ShiftEnter: EnterKeyEffect.NEW_PAGE,
      Wheel: WheelEffect.SCROLL_DOCUMENT,
      CmdOrCtrlWheel: PinchEffect.ZOOM,
      ClickDrag: ClickDragEffect.PAN_CANVAS,
      CmdOrCtrlClickDrag: ClickDragEffect.DISABLED,
    },
    browser: {
      visibility: BrowserVisibility.HIDDEN,
    },
    document: {
      visibility: DocumentVisibility.WHEN_ACTIVE,
      height: {
        value: DocumentHeight.FULLSCREEN,
        options: {
          defaultContainerHeight: 700,
        },
      },
      defaultWidth: 600,
      text: {
        fade: {
          value: FadeTextValue.UNSELECTED_PARAGRAPH,
        },
      },
      menu: {
        visibility: DocumentEffectVisibility.HIDDEN,
      },
      autoSave: DocumentAutoSave.DISABLED,
      grammar: {
        status: GrammarEffectStatus.DISABLED,
      },
    },
    canvas: {
      autoscroll: {
        value: Autoscroll.TYPEWRITER,
      },
      cursor: {
        visibility: CursorVisibility.HIDDEN_WHILE_TYPING,
      },
    },
    app: {
      startScreenState: StartScreenEffect.NOT_FULLSCREEN,
    },
  };
}

export function getDefaultBrainstormEffects(): EditorEffects {
  return {
    menu: {
      visibility: MenuVisibility.VISIBLE,
    },
    controls: {
      Enter: EnterKeyEffect.NEW_PAGE,
      ShiftEnter: EnterKeyEffect.NEW_PARAGRAPH,
      Wheel: WheelEffect.SCROLL_DOCUMENT,
      CmdOrCtrlWheel: PinchEffect.DISABLED,
      ClickDrag: ClickDragEffect.PAN_CANVAS,
      CmdOrCtrlClickDrag: ClickDragEffect.DISABLED,
    },
    browser: {
      visibility: BrowserVisibility.VISIBLE,
    },
    document: {
      visibility: DocumentVisibility.VISIBLE,
      height: {
        value: DocumentHeight.FIT_CONTENT,
        options: {
          defaultContainerHeight: 700,
        },
      },
      defaultWidth: 600,
      text: {
        fade: {
          value: FadeTextValue.NEVER,
        },
      },
      menu: {
        visibility: DocumentEffectVisibility.VISIBLE,
      },
      autoSave: DocumentAutoSave.DISABLED,
      grammar: {
        status: GrammarEffectStatus.DISABLED,
      },
    },
    canvas: {
      autoscroll: {
        value: Autoscroll.NONE,
      },
      cursor: {
        visibility: CursorVisibility.VISIBLE,
      },
    },
    app: {
      startScreenState: StartScreenEffect.NOT_FULLSCREEN,
    },
  };
}

export function getDefaultModes(): Mode[] {
  return [
    {
      name: "Home",
      icon: MenuIcons.COPYWRITING,
      theme: "default",
      menu: {
        defaultState: ModeMenuState.OPEN,
        items: [
          { key: MenuItemKey.VIEW_CONTROLS },
          { key: MenuItemKey.WORKSPACE_CHOOSER },
          { key: MenuItemKey.OPEN_EDITORS },
          { key: MenuItemKey.FILE_EXPLORER },
        ],
      },
      editorEffects: getDefaultHomeEffects(),
    },
    {
      name: "Focus",
      icon: MenuIcons.WRITING,
      theme: "default",
      menu: {
        defaultState: ModeMenuState.CLOSED,
        items: [{ key: MenuItemKey.VIEW_CONTROLS }],
      },
      editorEffects: getDefaultFocusEffects(),
    },
    {
      name: "Brainstorm",
      icon: MenuIcons.NOTEBOOK,
      theme: "default",
      menu: {
        defaultState: ModeMenuState.OPEN,
        items: [
          { key: MenuItemKey.VIEW_CONTROLS },
          { key: MenuItemKey.OPEN_EDITORS },
        ],
      },
      editorEffects: getDefaultBrainstormEffects(),
    },
  ];
}

export function reconcileModeSettings(modes: Mode[]): Mode[] {
  const defaultMode = getDefaultMode();

  const reconciledModes = modes.map((mode: Mode) => {
    const editorEffects = deepmerge(
      defaultMode.editorEffects,
      mode.editorEffects
    );
    mode.editorEffects = editorEffects;
    return mode;
  });

  return reconciledModes;
}

export function loadProfileData(profile: Partial<ProfileData>): ProfileData {
  return {
    get activeMode() {
      if (this.modes.length > this.selectedMode) {
        return this.modes[this.selectedMode];
      } else if (this.modes.length > 0) {
        // this.selectedMode = 0;
        return this.modes[0];
      } else {
        throw new Error("no modes exist");
      }
    },
    selectedMode: profile.selectedMode !== undefined ? profile.selectedMode : 0,
    modes:
      profile.modes !== undefined
        ? reconcileModeSettings(profile.modes)
        : getDefaultModes(),
  };
}

export function getDefaultProfile(): ProfileData {
  return {
    get activeMode() {
      if (this.modes.length > this.selectedMode) {
        return this.modes[this.selectedMode];
      } else if (this.modes.length > 0) {
        // this.selectedMode = 0;
        return this.modes[0];
      } else {
        throw new Error("no modes exist");
      }
    },
    selectedMode: 0,
    modes: getDefaultModes(),
  };
}

export function createAppData(
  appEnvironment: AppEnvironment,
  initialDoc?: DocumentRoot
): AppData {
  const documents: DocumentRoot[] = [];
  if (initialDoc) {
    documents.push(initialDoc);
  }

  return {
    selecting: null,
    fullScreen: false,
    get activeWorkspace() {
      if (
        this.selectedWorkspace &&
        this.workspaces[this.selectedWorkspace] !== undefined
      ) {
        return this.workspaces[this.selectedWorkspace];
      } else {
        return null;
      }
    },
    selectedWorkspace: "",
    workspaces: {},

    get activeProfile() {
      if (
        this.selectedProfile &&
        this.profiles[this.selectedProfile] !== undefined
      ) {
        return this.profiles[this.selectedProfile];
      } else {
        return getDefaultProfile();
      }
    },
    selectedProfile: "default",
    profiles: {
      default: getDefaultProfile(),
    },
    authStatus: "initializing",
    status: AppDataStatus.STARTING_UP,
    appEnvironment,
    typing: false,
    networkStatus: navigator.onLine
      ? AppNetworkStatus.ONLINE
      : AppNetworkStatus.OFFLINE,
    authState: AuthState.NOT_CHECKED,
    uid: "",
    userData: {
      email: "",
      username: "",
      joined: 0,
      loginCount: 0,
      lastActive: 0,
      customerId: "",
      activePlans: [],
      activeProducts: [],
      subscriptionInfo: {
        trials: [],
      },
    },
    get computedSubscriptionInfo() {
      let activeTier: "basic" | "pro" = "basic";
      let trialActive: boolean = false;
      let trialAvailable: boolean = false;
      let trialExpires: number = 0;

      // TODO: loop over subscriptions, if one for pro is active, apply pro

      // loop over trials, if one for pro is active, apply pro
      this.userData.subscriptionInfo.trials.forEach((trial: Trial) => {
        if (
          trial.activated > 0 &&
          Date.now() < trial.activated + trial.length
        ) {
          activeTier = "pro";
          trialActive = true;
          trialExpires = trial.activated + trial.length;
        }

        if (trial.activated === 0) {
          trialAvailable = true;
        }
      });

      if (
        this.userData.activePlans.indexOf(
          process.env.REACT_APP_PRO_PLAN_ID || ""
        ) > -1
      ) {
        activeTier = "pro";
        trialActive = false;
      }

      if (
        this.userData.activePlans.indexOf(
          process.env.REACT_APP_PRO_PRODUCT_ID || ""
        ) > -1
      ) {
        activeTier = "pro";
        trialActive = false;
      }

      if (
        this.userData.activeProducts.indexOf(
          process.env.REACT_APP_PRO_DESKTOP_ID || ""
        ) > -1
      ) {
        activeTier = "pro";
        trialActive = false;
      }

      return {
        activeTier,
        trialActive,
        trialAvailable,
        trialExpires,
      };
    },
    userTier: UserTier.BASIC,
    accountSettingsOpen: false,
    workspaceSettingsOpen: false,
    processSettingsOpen: false,
    draggingAnything: false,
    svgElement: null,
    history: [],
    future: [],
    undo() {},
    redo() {},
    save() {},
    handleKeyDown(evt: KeyboardEvent) {
      if (this.activeWorkspace !== null) {
        this.typing = true;

        for (let i = 0; i < this.activeWorkspace.selection.length; i++) {
          const range = this.activeWorkspace.selection[i];

          if (evt.key === "ArrowLeft") {
            this.activeWorkspace.documents[range.documentIndex].arrowLeft(
              range
            );
          } else if (evt.key === "ArrowRight") {
            this.activeWorkspace.documents[range.documentIndex].arrowRight(
              range
            );
          } else if (evt.key === "ArrowUp") {
            this.activeWorkspace.documents[range.documentIndex].arrowUp(range);
          } else if (evt.key === "ArrowDown") {
            this.activeWorkspace.documents[range.documentIndex].arrowDown(
              range
            );
          } else if (evt.key === "Enter") {
            if (evt.shiftKey) {
              if (
                this.activeProfile.activeMode.editorEffects.controls
                  .ShiftEnter === EnterKeyEffect.NEW_PAGE
              ) {
                loadNewMarkdownFile(this);
              } else if (
                this.activeProfile.activeMode.editorEffects.controls
                  .ShiftEnter === EnterKeyEffect.NEW_PARAGRAPH
              ) {
                this.activeWorkspace.documents[
                  range.documentIndex
                ].carriageReturn(range);
              }
            } else {
              if (
                this.activeProfile.activeMode.editorEffects.controls.Enter ===
                EnterKeyEffect.NEW_PAGE
              ) {
                loadNewMarkdownFile(this);
              } else if (
                this.activeProfile.activeMode.editorEffects.controls.Enter ===
                EnterKeyEffect.NEW_PARAGRAPH
              ) {
                this.activeWorkspace.documents[
                  range.documentIndex
                ].carriageReturn(range);
              }
            }
          } else if (evt.key === "Delete") {
            if (range.documentIndex < this.activeWorkspace.documents.length) {
              this.activeWorkspace.documents[range.documentIndex].delete(range);
            }
          } else if (evt.key === "Backspace") {
            if (range.documentIndex < this.activeWorkspace.documents.length) {
              this.activeWorkspace.documents[range.documentIndex].backspace(
                range
              );
            }
          } else if (evt.key === "Shift") {
          } else if (evt.key === "Alt") {
          } else if (evt.key === "Meta") {
          } else if (evt.key === "Tab") {
            evt.preventDefault();
            if (range.documentIndex < this.activeWorkspace.documents.length) {
              if (evt.shiftKey) {
                this.activeWorkspace.documents[range.documentIndex].shiftTab(
                  range
                );
              } else {
                this.activeWorkspace.documents[range.documentIndex].tab(range);
              }
            }
          } else if (evt.key === "ContextMenu") {
          } else if (evt.key === "Escape") {
          } else if (evt.key.length === 1 && !isControlModifierActive(evt)) {
            let letter = evt.key;

            if (range.documentIndex < this.activeWorkspace.documents.length) {
              this.activeWorkspace.documents[range.documentIndex].insertLetter(
                range,
                letter
              );
            }
          } else if (isControlModifierActive(evt)) {
            let letter = evt.key;

            if (letter === "z") {
              evt.preventDefault();
              this.undo();
              console.log("undoing");
            }
          }
        }
      }
    },
    handleCopy(evt: ClipboardEvent) {
      if (
        this.activeWorkspace &&
        this.activeWorkspace.selection.length > 0 &&
        evt.clipboardData
      ) {
        const range = this.activeWorkspace.selection[0];
        const document = this.activeWorkspace.documents[range.documentIndex];

        const copiedDoc = document.copyRange(range);

        // @ts-ignore
        const copiedText = markdownProcessor.stringify(copiedDoc);
        const copiedHtml = remarkToHtmlProcessor
          .processSync(copiedText)
          .contents.toString();

        console.log("xr: copied text - \n\n", copiedText);
        console.log("xr: copied html - \n\n", copiedHtml);

        evt.clipboardData.setData("text/plain", copiedText);
        evt.clipboardData.setData("text/html", copiedHtml);
      }
    },
    handleCut(evt: ClipboardEvent) {
      if (
        this.activeWorkspace &&
        this.activeWorkspace.selection.length > 0 &&
        evt.clipboardData
      ) {
        const range = this.activeWorkspace.selection[0];
        const document = this.activeWorkspace.documents[range.documentIndex];

        const copiedDoc = document.cutRange(range);

        // @ts-ignore
        const copiedText = markdownProcessor.stringify(copiedDoc);
        const copiedHtml = remarkToHtmlProcessor
          .processSync(copiedText)
          .contents.toString();

        console.log("xr: cut text - \n\n", copiedText);
        console.log("xr: cut html - \n\n", copiedHtml);

        evt.clipboardData.setData("text/plain", copiedText);
        evt.clipboardData.setData("text/html", copiedHtml);
      }
    },
    handlePaste(evt: ClipboardEvent) {
      if (
        this.activeWorkspace &&
        this.activeWorkspace.selection.length > 0 &&
        evt.clipboardData
      ) {
        const range = this.activeWorkspace.selection[0];
        const document = this.activeWorkspace.documents[range.documentIndex];

        const textToPaste = evt.clipboardData.getData("text/plain");
        const htmlToPaste = evt.clipboardData.getData("text/html");

        let contentToPaste: DocumentRoot | null = null;

        if (htmlToPaste) {
          // convert html to markdown, then markdown to mdast
          const resultMd = htmlProcessor
            .processSync(htmlToPaste)
            .contents.toString();
          contentToPaste = loadDocumentFromMarkdown(resultMd);
        } else if (textToPaste) {
          contentToPaste = loadDocumentFromMarkdown(textToPaste);
        }

        if (contentToPaste) {
          document.pasteFromClipboard(contentToPaste, range);
        }
      }
    },
  };
}
