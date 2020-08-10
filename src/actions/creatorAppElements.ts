import { PAGE_PADDING, PAGE_WIDTH } from "misc/constants";
import { DocumentPosition, SelectionRange } from "types";
import {
  indentRange,
  dedentRange,
  flattenListTreeToBlocks,
  insertContentToRoot,
} from "./actionsAppElements";
import { markdownProcessor } from "../hooks/useData";
import { getNodeLength } from "../misc/utls";
import { liftElement, cloneRange, processMarkdown } from "./actionsAppElements";
import {
  BlockContent,
  Delete,
  DocumentRoot,
  Emphasis,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Strong,
  Text,
  TopLevelContent,
} from "types/appTypes";
import {
  BlockContentTypes,
  mdBlockContent,
  mdContent,
  mdDelete,
  mdEmphasis,
  mdHeading,
  mdImage,
  mdLink,
  mdList,
  mdListItem,
  mdNodeType,
  mdParagraph,
  mdPhrasingContent,
  mdRoot,
  mdStrong,
  mdText,
} from "types/mdastTypes";

import {
  arrowLeft,
  arrowRight,
  arrowUp,
  arrowDown,
  deleteRange,
  insertKey,
  carriageReturn,
} from "./actionsAppElements";

function calculateNodeHeight(children: TopLevelContent[]): number {
  let height = 0;

  children.forEach((child: TopLevelContent) => {
    if (child.type === mdNodeType.HEADING) {
      height += child.height + 16;
    } else if (child.type === mdNodeType.PARAGRAPH) {
      height += child.height + 8;
    } else if (child.type === mdNodeType.LIST) {
      child.children.forEach((listItem: ListItem) => {
        height += calculateNodeHeight(listItem.children);
      });
    }
  });

  return height;
}

export function loadDocumentFromMarkdown(
  markdownContent: string
): DocumentRoot {
  const parsed = markdownProcessor.parse(markdownContent);

  // @ts-ignore
  return createDocumentRoot(parsed);
}

export function stringifyDocumentRoot(document: DocumentRoot): string {
  // @ts-ignore
  return markdownProcessor.stringify(document);
}

export function createDocumentRoot(
  node: mdRoot,
  position?: DocumentPosition,
  path?: string
): DocumentRoot {
  return {
    type: mdNodeType.ROOT,
    get name() {
      if (this.path) {
        let sliceStart = this.path.lastIndexOf("/");
        if (sliceStart === -1) {
          sliceStart = this.path.lastIndexOf("\\");
        }
        let sliceEnd = this.path.lastIndexOf(".");
        return this.path.slice(sliceStart + 1, sliceEnd);
      } else {
        return "Untitled";
      }
    },
    path,
    needsProcessing: false,
    unsavedChanges: false,
    children: createContent(node.children),
    position: position || {
      x: 100,
      y: 100,
    },
    dragging: false,
    width: PAGE_WIDTH,
    get height() {
      let pageHeight =
        this.padding.top +
        this.padding.bottom +
        calculateNodeHeight(this.children);
      return pageHeight;
    },
    padding: {
      top: PAGE_PADDING,
      bottom: PAGE_PADDING,
      left: PAGE_PADDING,
      right: PAGE_PADDING,
    },
    scrollOffset: 0,
    scrollContainerHeight: 700,
    arrowLeft(range: SelectionRange) {
      arrowLeft(this, range);
    },
    arrowRight(range: SelectionRange) {
      arrowRight(this, range);
    },
    arrowUp(range: SelectionRange) {
      arrowUp(this, range);
    },
    arrowDown(range: SelectionRange) {
      arrowDown(this, range);
    },
    processMarkdown(range: SelectionRange) {
      // TODO: remake this function
    },
    insertLetter(range: SelectionRange, letter: string) {
      if (
        range.start.block !== range.end.block &&
        range.start.offset !== range.end.offset
      ) {
        deleteRange(this, range);
      }
      insertKey(this, range, letter);
      this.unsavedChanges = true;
    },
    backspace(range: SelectionRange) {
      if (
        range.start.block === range.end.block &&
        range.start.offset === range.end.offset
      ) {
        let liftedListItem = false;
        if (range.start.offset === -1 && range.end.offset === -1) {
          // check if at a list item and hoist it instead
          liftedListItem = liftElement(this, range);
        }

        if (!liftedListItem) {
          if (range.start.offset > -1) {
            range.start.offset -= 1;
          } else if (range.start.block > 0) {
            range.start.block -= 1;
            const blocks = flattenListTreeToBlocks(this);
            const nodeLength = getNodeLength(blocks[range.start.block]) - 1;
            range.start.offset = nodeLength;
          }
          deleteRange(this, range);
        }
      } else {
        deleteRange(this, range);
      }
    },
    delete(range: SelectionRange) {
      if (
        range.start.block === range.end.block &&
        range.start.offset === range.end.offset
      ) {
        const blocks = flattenListTreeToBlocks(this);
        const nodeLength = getNodeLength(blocks[range.end.block]);
        if (range.end.offset < nodeLength) {
          range.end.offset += 1;
        } else if (range.end.block < blocks.length) {
          range.end.block += 1;
          range.end.offset = -1;
        }
      }
      deleteRange(this, range);
    },
    carriageReturn(range: SelectionRange) {
      processMarkdown(this, range, 0);
      if (
        range.start.block !== range.end.block ||
        (range.start.block === range.end.block &&
          range.start.offset !== range.end.offset)
      ) {
        deleteRange(this, range);
      }
      carriageReturn(this, range);
    },
    tab(range: SelectionRange) {
      indentRange(this, range);
    },
    shiftTab(range: SelectionRange) {
      dedentRange(this, range);
    },
    cleanupNodes() {
      // TODO: see if this can just be removed
      // cleanupNodesV1(this);
    },
    copyRange(range: SelectionRange): mdRoot {
      const copiedRoot: mdRoot = {
        type: mdNodeType.ROOT,
        children: [],
      };

      const copiedBlocks: TopLevelContent[] = cloneRange(this, range, 0);

      // @ts-ignore
      copiedRoot.children = copiedBlocks;

      return copiedRoot;
    },
    cutRange(range: SelectionRange): mdRoot {
      const copiedRoot: mdRoot = {
        type: mdNodeType.ROOT,
        children: [],
      };

      const copiedBlocks: TopLevelContent[] = cloneRange(this, range, 0);

      deleteRange(this, range);

      // @ts-ignore
      copiedRoot.children = copiedBlocks;

      return copiedRoot;
    },
    pasteFromClipboard(pasteContent: DocumentRoot, range: SelectionRange) {
      deleteRange(this, range);

      insertContentToRoot(this, pasteContent, range);
    },
  };
}

export function createContent(nodes: mdContent[]): TopLevelContent[] {
  const content = nodes.map((node: mdContent) => {
    if (BlockContentTypes.includes(node.type)) {
      return createBlockContent(node as mdBlockContent);
    }
    throw new Error(`Unsupported type passed to createContent: ${node.type}`);
  });

  // TOOD: this breaks all tests
  // Rewrite in a way such that it doesn't

  // const numBlocks = content.length;
  // let currentLine = 1;

  // for (let i = 1; i < numBlocks * 2; i += 2) {
  //   content.splice(i, 0, createParagraphFromApp([createTextFromValue("")]));
  // }

  return content;
}

export function createBlockContent(node: mdBlockContent): BlockContent {
  if (node.type === mdNodeType.PARAGRAPH) {
    return createParagraphFromMD(node);
  } else if (node.type === mdNodeType.HEADING) {
    return createHeading(node);
  } else if (node.type === mdNodeType.LIST) {
    return createList(node);
  }
  throw new Error(
    `Unsupported type passed to createBlockContent: ${node.type}`
  );
}

export function createParagraphFromMD(node?: mdParagraph): Paragraph {
  return {
    type: mdNodeType.PARAGRAPH,
    children: node ? createPhrasingContent(node.children) : [createText()],
    height: 0,
  };
}

export function createParagraphFromApp(nodes: PhrasingContent[]): Paragraph {
  return {
    type: mdNodeType.PARAGRAPH,
    children: nodes,
    height: 0,
  };
}

export function createHeading(node: mdHeading): Heading {
  return {
    type: mdNodeType.HEADING,
    children: createPhrasingContent(node.children),
    depth: node.depth,
    height: 0,
  };
}

export function createList(node: mdList): List {
  return {
    type: mdNodeType.LIST,
    ordered: node.ordered,
    start: node.start,
    spread: node.spread,
    children: node.children.map(createListItem),
    height: 0,
  };
}

export function createEmptyList(ordered: boolean): List {
  return {
    type: mdNodeType.LIST,
    ordered,
    start: 0,
    spread: false,
    children: [],
    height: 0,
  };
}

export function createListItem(node: mdListItem): ListItem {
  return {
    type: mdNodeType.LIST_ITEM,
    checked: node.checked,
    spread: node.spread,
    children:
      node.children.length > 0
        ? node.children.map(createBlockContent)
        : [createParagraphFromApp([createTextFromValue("")])],
    height: 0,
  };
}

export function createNewListItem(
  children: BlockContent[],
  checked?: boolean,
  spread?: boolean
): ListItem {
  return {
    type: mdNodeType.LIST_ITEM,
    checked,
    spread,
    children: children,
    height: 0,
  };
}

export function createPhrasingContent(
  nodes: mdPhrasingContent[]
): PhrasingContent[] {
  return nodes.map(
    (node: mdPhrasingContent): PhrasingContent => {
      if (node.type === mdNodeType.TEXT) {
        return createText(node);
      } else if (node.type === mdNodeType.EMPHASIS) {
        return createEmphasis(node);
      } else if (node.type === mdNodeType.STRONG) {
        return createStrong(node);
      } else if (node.type === mdNodeType.DELETE) {
        return createDelete(node);
      } else if (node.type === mdNodeType.LINK) {
        return createLink(node);
      } else if (node.type === mdNodeType.IMAGE) {
        return createImage(node);
      }

      throw new Error(
        `Unsupported type passed to createPhrasingContent: ${node.type}`
      );
    }
  );
}

export function createLink(node: mdLink): Link {
  return {
    type: mdNodeType.LINK,
    url: node.url,
    title: node.title,
    children: createPhrasingContent(node.children),
  };
}

export function createImage(node: mdImage): Image {
  return {
    type: mdNodeType.IMAGE,
    url: node.url,
    title: node.title,
    alt: node.alt,
    width: 350,
    height: 350,
    charData: {
      type: "image",
      index: 0,
      char: "",
      height: 350,
      width: 350,
      x: 0,
      y: 0,
    },
  };
}

export function createText(node?: mdText): Text {
  return {
    type: mdNodeType.TEXT,
    value: node ? node.value : "",
    charData: [],
  };
}

export function createTextFromValue(value: string): Text {
  return {
    type: mdNodeType.TEXT,
    value,
    charData: [],
  };
}

export function createEmphasis(node: mdEmphasis): Emphasis {
  return {
    type: mdNodeType.EMPHASIS,
    children: createPhrasingContent(node.children),
  };
}

export function createStrong(node: mdStrong): Strong {
  return {
    type: mdNodeType.STRONG,
    children: createPhrasingContent(node.children),
  };
}

export function createDelete(node: mdDelete): Delete {
  return {
    type: mdNodeType.DELETE,
    children: createPhrasingContent(node.children),
  };
}
