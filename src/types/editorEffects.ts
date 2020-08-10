export enum EnterKeyEffect {
  NEW_PARAGRAPH = "NEW_PARAGRAPH",
  NEW_PAGE = "NEW_PAGE",
  NOTHING = "NOTHING"
}

export enum PinchEffect {
  ZOOM = "ZOOM",
  DISABLED = "DISABLED"
}

export enum WheelEffect {
  SCROLL_DOCUMENT = "SCROLL_DOCUMENT",
  PAN_CANVAS = "PAN_CANVAS",
  DISABLED = "DISABLED"
}

export enum ClickDragEffect {
  PAN_CANVAS = "PAN_CANVAS",
  // SELECTION_BOX = "SELECTION_BOX",
  DISABLED = "DISABLED"
}

export interface ControlEffects {
  Enter: EnterKeyEffect;
  ShiftEnter: EnterKeyEffect;
  Wheel: WheelEffect;
  CmdOrCtrlWheel: PinchEffect;
  ClickDrag: ClickDragEffect;
  CmdOrCtrlClickDrag: ClickDragEffect;
}

export enum MenuVisibility {
  VISIBLE = "VISIBLE",
  WHEN_HOVERED = "WHEN_HOVERED"
}

export interface MenuEffects {
  visibility: MenuVisibility;
}

export enum BrowserVisibility {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN"
}

export interface BrowserEffects {
  visibility: BrowserVisibility;
}

export enum DocumentVisibility {
  VISIBLE = "VISIBLE",
  WHEN_ACTIVE = "WHEN_ACTIVE",
  HIDDEN = "HIDDEN"
}

export enum DocumentHeight {
  FIT_CONTENT = "FIT_CONTENT",
  FULLSCREEN = "FULLSCREEN",
  CUSTOM = "CUSTOM"
}

export enum FadeTextValue {
  NEVER = "NEVER",
  // UNSELECTED_SENTENCE = "UNSELECTED_SENTENCE",
  UNSELECTED_PARAGRAPH = "UNSELECTED_PARAGRAPH"
}

export interface FadeTextEffect {
  value: FadeTextValue;
  options?: any;
}

export interface TextEffect {
  fade: FadeTextEffect;
}

export enum DocumentEffectVisibility {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN"
}

export interface DocumentMenuEffect {
  visibility: DocumentEffectVisibility;
}

export interface DocumentHeightEffect {
  value: DocumentHeight;
  options: {
    defaultContainerHeight: number;
  };
}

export enum DocumentAutoSave {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export enum GrammarEffectStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export interface GrammarEffect {
  status: GrammarEffectStatus;

  // TODO: actually do some research and model this out to support configuring
  // multiple pieces of the grammar effect
}

export interface DocumentEffects {
  visibility: DocumentVisibility;
  height: DocumentHeightEffect;
  defaultWidth: number;
  text: TextEffect;
  menu: DocumentMenuEffect;
  autoSave: DocumentAutoSave;
  grammar: GrammarEffect;
}

export enum Autoscroll {
  NONE = "NONE",
  TYPEWRITER = "TYPEWRITER"
}

export interface AutoscrollEffect {
  value: Autoscroll;
  options?: any;
}

export enum CursorVisibility {
  VISIBLE = "VISIBLE",
  HIDDEN_WHILE_TYPING = "HIDDEN_WHILE_TYPING"
}
export interface CursorEffect {
  visibility: CursorVisibility;
}

export interface CanvasEffects {
  autoscroll: AutoscrollEffect;
  cursor: CursorEffect;
}

export enum StartScreenEffect {
  PREVIOUS = "PREVIOUS",
  FULLSCREEN = "FULLSCREEN",
  NOT_FULLSCREEN = "NOT_FULLSCREEN"
}

export interface AppEffects {
  startScreenState: StartScreenEffect;
}

export interface EditorEffects {
  menu: MenuEffects;
  controls: ControlEffects;
  browser: BrowserEffects;
  document: DocumentEffects;
  canvas: CanvasEffects;
  app: AppEffects;
}
