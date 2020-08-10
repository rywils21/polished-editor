import { EditorEffects } from "./editorEffects";
import { DocumentRoot } from "./appTypes";
import { KeyboardEvent, RefObject } from "react";
import { MenuIcons } from "components-ui/MenuIcon";

export interface AppConfig {
  showAlphaBanner: boolean;
  marketing: boolean;
  startWithWriteMusic: boolean;
}

export interface WordData {
  word: string;
  isWhiteSpace: boolean;
  start: number;
  end: number;
  length: number;
  width: number;
}

export interface CharData {
  type: "char" | "image";
  char: string;
  height: number;
  index: number;
  width: number;
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface DocumentPosition {
  x: number;
  y: number;
}

export interface ViewState {
  x: number;
  y: number;
  zoom: number;
}

export interface TextStyle {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  fontStyle: string;
  textDecoration: string;
  opacity: number;
}

export enum ResizeDirection {
  NS = "ns",
  EW = "ew",
}

export interface BrowserObject {
  position: DocumentPosition;
  dragging: boolean;
  resizing: ResizeDirection[];
  width: number;
  height: number;
  src: string;
}

export interface UserSettings {
  email: string;
  username: string;
  joined: number;
  lastActive: number;
  purchases: any[];
}

export interface ElectronUserSettings extends UserSettings {
  authenticated: boolean;
}

export enum AppEnvironment {
  WEB_DEMO = "web_demo",
  ELECTRON = "electron",
}

export enum AppNetworkStatus {
  ONLINE = "online",
  OFFLINE = "offline",
}

export enum AuthState {
  NOT_CHECKED = "not_checked",
  UNAUTHENTICATED = "unauthenticated",
  LOGGING_IN = "logging_in",
  CREATING_ACCOUNT = "creating_account",
  INITIALIZING_SESSION = "initializing_session",
  AUTHENTICATED = "authenticated",
  SIGNING_OUT = "signing_out",
  MISSING_EMAIL = "missing_email",
}

export enum UserTier {
  BASIC = "basic",
  PRO_TOOLS = "pro_tools",
}

export enum ProductSKU {
  BASIC = "basic",
}

export enum PurchaseStatus {
  ACTIVE = "active",
}

export interface Purchase {
  sku: ProductSKU;
  datePurchased: number;
  status: PurchaseStatus;
}

export interface RangeIndex {
  block: number;
  offset: number;
}

export interface SelectionRange {
  documentIndex: number;
  start: RangeIndex;
  end: RangeIndex;
}

export interface WorkspaceData {
  name: string;
  rootDir: string;
  files: string[];
  documents: DocumentRoot[];
  browsers: BrowserObject[];
  view: ViewState;
  selection: SelectionRange[];
}

export enum MenuItemKey {
  OPEN_EDITORS = "Open Editors",
  FILE_EXPLORER = "File Explorer",
  WORKSPACE_CHOOSER = "Workspace Chooser",
  DOCUMENT_OUTLINE = "Document Outline",
  MODE_NAME = "Mode Name",
  VIEW_CONTROLS = "View Controls",
}

export interface ModeMenuItem {
  key: MenuItemKey;
  options?: any;
}

export enum ModeMenuState {
  OPEN = "open",
  CLOSED = "closed",
}

export interface ModeMenu {
  defaultState: ModeMenuState;
  items: ModeMenuItem[];
}

export interface Mode {
  name: string;
  icon: MenuIcons;
  theme: string;
  menu: ModeMenu;
  editorEffects: EditorEffects;
}

export interface ProfileData {
  activeMode: Mode;
  selectedMode: number;
  modes: Mode[];
}

export enum AppDataStatus {
  STARTING_UP = "Starting up",
  LOADING_SETTINGS = "Loading settings",
  LOADING_DATA = "Loading data",
  INTERACTIVE = "interactive",
}

export enum SubscriptionTier {
  PRO = "Pro Writing Tools",
}

export interface Trial {
  tier: SubscriptionTier;
  granted: number;
  activated: number;
  length: number;
}

export interface SubscriptionInfo {
  trials: Trial[];
}

export interface UserData {
  email: string;
  username: string;
  joined: number;
  lastActive: number;
  loginCount: number;
  customerId: string;
  activePlans: string[];
  activeProducts: string[];
  subscriptionInfo: SubscriptionInfo;
}

export interface ComputedSubscriptionInfo {
  activeTier: "basic" | "pro";
  trialActive: boolean;
  trialAvailable: boolean;
  trialExpires: number;
}

export interface PureAppData {
  activeWorkspace: WorkspaceData | null;
  selectedWorkspace: string;
  workspaces: {
    [s: string]: WorkspaceData;
  };

  activeProfile: ProfileData;
  selectedProfile: string;
  profiles: {
    [s: string]: ProfileData;
  };

  selecting: SelectionRange | null;

  fullScreen: boolean;
  typing: boolean;
  draggingAnything: boolean;

  accountSettingsOpen: boolean;
  workspaceSettingsOpen: boolean;
  processSettingsOpen: boolean;
}

export interface AppData extends PureAppData {
  authStatus: "initializing" | "ready";
  status: AppDataStatus;
  appEnvironment: AppEnvironment;
  networkStatus: AppNetworkStatus;
  authState: AuthState;
  uid: string;
  userData: UserData;
  computedSubscriptionInfo: ComputedSubscriptionInfo;
  userTier: UserTier;
  svgElement: RefObject<SVGElement> | null;
  history: PureAppData[];
  future: PureAppData[];
  undo: () => void;
  redo: () => void;
  save: () => void;
  handleKeyDown: (evt: KeyboardEvent) => void;
  handleCopy: (evt: ClipboardEvent) => void;
  handleCut: (evt: ClipboardEvent) => void;
  handlePaste: (evt: ClipboardEvent) => void;
}

export interface ElectronMarkdownFile {
  path: string;
  content: string;
}
