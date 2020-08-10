import { DocumentPosition, CharData, SelectionRange } from "./index";
import { mdNodeType, mdRoot } from "./mdastTypes";

export type Content =
  | TopLevelContent
  | ListContent
  // | TableContent
  // | RowContent
  | PhrasingContent
  | DocumentRoot;

export type TopLevelContent = BlockContent;
// | FrontmatterContent
// | DefinitionContent;

export type BlockContent = Paragraph | Heading | List;
// | ThematicBreak
// | BlockQuote
// | List
// | Table
// | HTML
// | Code;
// export type FrontmatterContent = YAML;
// export type DefinitionContent = Definition | FootnoteDefinition;
// export type ListContent = ListItem;
// export type TableContent = TableRow;
// export type RowContent = TableCell;
export type PhrasingContent = StaticPhrasingContent | Link;
// | LinkReference;
export type StaticPhrasingContent = Text | Emphasis | Strong | Delete | Image;
// | HTML
// | InlineCode
// | Break
// | ImageReference
// | Footnote
// | FootnoteReference;
export type ListContent = ListItem;

export interface Parent {
  children: Content[];
}

export interface Literal {
  value: string;
}

export interface Node {
  children?: Content[];
  value?: string;
}

export interface Block {
  height: number;
}

export interface BlockContentAttributes extends Block, Node {}

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface DocumentRoot extends Node {
  type: mdNodeType.ROOT;
  name: string;
  path?: string;
  needsProcessing: boolean;
  unsavedChanges: boolean;
  children: TopLevelContent[];
  position: DocumentPosition;
  dragging: boolean;
  width: number;
  height: number;
  padding: Padding;
  scrollOffset: number;
  scrollContainerHeight: number;
  arrowLeft: (range: SelectionRange) => void;
  arrowRight: (range: SelectionRange) => void;
  arrowUp: (range: SelectionRange) => void;
  arrowDown: (range: SelectionRange) => void;
  processMarkdown: (range: SelectionRange) => void;
  insertLetter: (range: SelectionRange, letter: string) => void;
  backspace: (range: SelectionRange) => void;
  delete: (range: SelectionRange) => void;
  carriageReturn: (range: SelectionRange) => void;
  tab: (range: SelectionRange) => void;
  shiftTab: (range: SelectionRange) => void;
  cleanupNodes: () => void;
  copyRange: (range: SelectionRange) => mdRoot;
  cutRange: (range: SelectionRange) => void;
  pasteFromClipboard: (
    pasteContent: DocumentRoot,
    range: SelectionRange
  ) => void;
}

export interface Paragraph extends BlockContentAttributes {
  type: mdNodeType.PARAGRAPH;
  children: PhrasingContent[];
}

export interface Heading extends BlockContentAttributes {
  type: mdNodeType.HEADING;
  depth: number;
  children: PhrasingContent[];
}

export interface List extends BlockContentAttributes {
  type: mdNodeType.LIST;
  ordered: boolean;
  start?: number;
  spread?: boolean;
  children: ListContent[];
}

export interface ListItem extends BlockContentAttributes {
  type: mdNodeType.LIST_ITEM;
  checked?: boolean;
  spread?: boolean;
  children: BlockContent[];
}

export interface Image extends Node {
  type: mdNodeType.IMAGE;
  url: string;
  title?: string;
  alt?: string;
  width: number;
  height: number;
  charData: CharData;
}

export interface Link extends Node {
  type: mdNodeType.LINK;
  url: string;
  title?: string;
  children: PhrasingContent[];
}

export interface Text extends Node {
  type: mdNodeType.TEXT;
  value: string;
  charData: CharData[];
}

export interface Emphasis extends Node {
  type: mdNodeType.EMPHASIS;
  children: PhrasingContent[];
}

export interface Strong extends Node {
  type: mdNodeType.STRONG;
  children: PhrasingContent[];
}

export interface Delete extends Node {
  type: mdNodeType.DELETE;
  children: PhrasingContent[];
}
