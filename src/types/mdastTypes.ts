// Content Types
export type mdContent =
  | mdTopLevelContent
  | mdListContent
  | mdTableContent
  | mdRowContent
  | mdPhrasingContent;
export type mdTopLevelContent =
  | mdBlockContent
  | mdFrontmatterContent
  | mdDefinitionContent;
export type mdBlockContent =
  | mdParagraph
  | mdHeading
  | mdThematicBreak
  | mdBlockQuote
  | mdList
  | mdTable
  | mdHTML
  | mdCode;
export type mdFrontmatterContent = mdYAML;
export type mdDefinitionContent = mdDefinition | mdFootnoteDefinition;
export type mdListContent = mdListItem;
export type mdTableContent = mdTableRow;
export type mdRowContent = mdTableCell;
export type mdPhrasingContent =
  | mdStaticPhrasingContent
  | mdLink
  | mdLinkReference;
export type mdStaticPhrasingContent =
  | mdText
  | mdEmphasis
  | mdStrong
  | mdDelete
  | mdHTML
  | mdInlineCode
  | mdBreak
  | mdImage
  | mdImageReference
  | mdFootnote
  | mdFootnoteReference;

export enum mdNodeType {
  ROOT = "root",
  PARAGRAPH = "paragraph",
  HEADING = "heading",
  THEMATIC_BREAK = "thematicBreak",
  BLOCKQUOTE = "blockquote",
  LIST = "list",
  LIST_ITEM = "listItem",
  TABLE = "table",
  TABLE_ROW = "tableRow",
  TABLE_CELL = "tableCell",
  HTML = "html",
  CODE = "code",
  YAML = "yaml",
  DEFINITION = "definition",
  FOOTNOTE_DEFINITION = "footnoteDefinition",
  TEXT = "text",
  EMPHASIS = "emphasis",
  STRONG = "strong",
  DELETE = "delete",
  INLINE_CODE = "inlineCode",
  BREAK = "break",
  LINK = "link",
  IMAGE = "image",
  LINK_REFERENCE = "linkReference",
  IMAGE_REFERENCE = "imageReference",
  FOOTNOTE = "footnote",
  FOOTNOTE_REFERENCE = "footnoteReference"
}

export const BlockContentTypes = [
  mdNodeType.PARAGRAPH,
  mdNodeType.HEADING,
  mdNodeType.THEMATIC_BREAK,
  mdNodeType.BLOCKQUOTE,
  mdNodeType.LIST,
  mdNodeType.TABLE,
  mdNodeType.HTML,
  mdNodeType.CODE
];

export const FrontMatterContentType = [mdNodeType.YAML];

export const DefinitionContentTypes = [
  mdNodeType.DEFINITION,
  mdNodeType.FOOTNOTE_DEFINITION
];

export const ListContentTypes = [mdNodeType.LIST_ITEM];

export const TableContentTypes = [mdNodeType.TABLE_ROW];

export const RowContentTypes = [mdNodeType.TABLE_CELL];

export const StaticPhrasingContentTypes = [
  mdNodeType.TEXT,
  mdNodeType.EMPHASIS,
  mdNodeType.STRONG,
  mdNodeType.DELETE,
  mdNodeType.HTML,
  mdNodeType.INLINE_CODE,
  mdNodeType.BREAK,
  mdNodeType.IMAGE,
  mdNodeType.IMAGE_REFERENCE,
  mdNodeType.FOOTNOTE,
  mdNodeType.FOOTNOTE_REFERENCE
];

export const PhrasingContentTypes = StaticPhrasingContentTypes.concat([
  mdNodeType.LINK,
  mdNodeType.LINK_REFERENCE
]);

export const TopLevelContentTypes = BlockContentTypes.concat(
  FrontMatterContentType
).concat(DefinitionContentTypes);

export const ContentTypes = TopLevelContentTypes.concat(ListContentTypes)
  .concat(TableContentTypes)
  .concat(RowContentTypes)
  .concat(PhrasingContentTypes);

// Mixins
export interface mdResourceMixin {
  url: string;
  title?: string;
}

export interface mdAssociationMixin {
  identifier: string;
  label?: string;
}

export interface mdReferenceMixin extends mdAssociationMixin {
  referenceType: mdReferenceType;
}

export interface mdAlternativeMixin {
  alt?: string;
}

// Enums
export enum mdAlignType {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center"
}

export enum mdReferenceType {
  SHORTCUT = "shortcut",
  COLLAPSED = "collapsed",
  FULL = "full"
}

// Nodes
export interface mdParent {
  children: mdContent[];
}

export interface mdLiteral {
  value: string;
}

export interface mdRoot extends mdParent {
  type: mdNodeType.ROOT;
}

export interface mdParagraph extends mdParent {
  type: mdNodeType.PARAGRAPH;
  children: mdPhrasingContent[];
}

export interface mdHeading extends mdParent {
  type: mdNodeType.HEADING;
  depth: number;
  children: mdPhrasingContent[];
}

export interface mdThematicBreak {
  type: mdNodeType.THEMATIC_BREAK;
}

export interface mdBlockQuote extends mdParent {
  type: mdNodeType.BLOCKQUOTE;
  children: mdBlockContent[];
}

export interface mdList extends mdParent {
  type: mdNodeType.LIST;
  ordered: boolean;
  start?: number;
  spread?: boolean;
  children: mdListContent[];
}

export interface mdListItem extends mdParent {
  type: mdNodeType.LIST_ITEM;
  checked?: boolean;
  spread?: boolean;
  children: mdBlockContent[];
}

export interface mdTable extends mdParent {
  type: mdNodeType.TABLE;
  align?: mdAlignType[];
  children: mdTableContent[];
}

export interface mdTableRow extends mdParent {
  type: mdNodeType.TABLE_ROW;
  children: mdRowContent[];
}

export interface mdTableCell extends mdParent {
  type: mdNodeType.TABLE_CELL;
  children: mdPhrasingContent[];
}

export interface mdHTML extends mdLiteral {
  type: mdNodeType.HTML;
}

export interface mdCode extends mdLiteral {
  type: mdNodeType.CODE;
  lang?: string;
  meta?: string;
}

export interface mdYAML extends mdLiteral {
  type: mdNodeType.YAML;
}

export interface mdDefinition extends mdAssociationMixin, mdResourceMixin {
  type: mdNodeType.DEFINITION;
}

export interface mdFootnoteDefinition extends mdParent, mdAssociationMixin {
  type: mdNodeType.FOOTNOTE_DEFINITION;
  children: mdBlockContent[];
}

export interface mdText extends mdLiteral {
  type: mdNodeType.TEXT;
}

export interface mdEmphasis extends mdParent {
  type: mdNodeType.EMPHASIS;
  children: mdPhrasingContent[];
}

export interface mdStrong extends mdParent {
  type: mdNodeType.STRONG;
  children: mdPhrasingContent[];
}

export interface mdDelete extends mdParent {
  type: mdNodeType.DELETE;
  children: mdPhrasingContent[];
}

export interface mdInlineCode extends mdLiteral {
  type: mdNodeType.INLINE_CODE;
}

export interface mdBreak {
  type: mdNodeType.BREAK;
}

export interface mdLink extends mdResourceMixin {
  type: mdNodeType.LINK;
  children: mdStaticPhrasingContent[];
}

export interface mdImage extends mdResourceMixin, mdAlternativeMixin {
  type: mdNodeType.IMAGE;
}

export interface mdLinkReference extends mdParent, mdReferenceMixin {
  type: mdNodeType.LINK_REFERENCE;
  children: mdStaticPhrasingContent[];
}

export interface mdImageReference extends mdReferenceMixin, mdAlternativeMixin {
  type: mdNodeType.IMAGE_REFERENCE;
}

export interface mdFootnote {
  type: mdNodeType.FOOTNOTE;
  children: mdPhrasingContent[];
}

export interface mdFootnoteReference extends mdAssociationMixin {
  type: mdNodeType.FOOTNOTE_REFERENCE;
}
